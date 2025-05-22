package com.cryptosim.service;

import com.cryptosim.dto.responses.CryptoPriceDataResponce;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.math.BigDecimal;
import java.net.URI;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class KrakenWebSocketService {
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;
    private WebSocketClient wsClient;
    private final Set<String> subscribedSymbols;
    
    @Value("${websocket.kraken.url}")
    private String krakenWsUrl;
    
    private final Map<String, BigDecimal> currentPrices = new ConcurrentHashMap<>();

    public KrakenWebSocketService(SimpMessagingTemplate messagingTemplate, ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
        this.subscribedSymbols = new HashSet<>();
    }

    @PostConstruct
    public void connect() {
        try {
            wsClient = new WebSocketClient(new URI(krakenWsUrl)) {
                @Override
                public void onOpen(ServerHandshake handshake) {
                    subscribeToSymbols("BTC/USD", "ETH/USD");
                }

                @Override
                public void onMessage(String message) {

                    try {
                        JsonNode jsonNode = objectMapper.readTree(message);
                        
                        if (jsonNode.has("method") && "subscribe".equals(jsonNode.get("method").asText())) {
                            return;
                        }

                        if (jsonNode.has("channel") && "ticker".equals(jsonNode.get("channel").asText())) {
                            JsonNode data = jsonNode.get("data").get(0);
                            String symbol = data.get("symbol").asText();
                            
                            CryptoPriceDataResponce priceData = new CryptoPriceDataResponce(
                                symbol,
                                data.get("last").asDouble(),
                                data.get("change").asDouble(),
                                data.get("high").asDouble(),
                                data.get("low").asDouble(),
                                data.get("change_pct").asDouble()
                            );
                            
                            currentPrices.put(symbol, new BigDecimal(String.valueOf(priceData.getPrice())));
                            messagingTemplate.convertAndSend("/prices", priceData);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void onClose(int code, String reason, boolean remote) {
                    scheduleReconnect();
                }

                @Override
                public void onError(Exception ex) {
                    ex.printStackTrace();
                }
            };
            wsClient.connect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void scheduleReconnect() {
        new Thread(() -> {
            try {
                Thread.sleep(5000);
                connect();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
    }

    public void subscribeToSymbols(String... symbols) {
        if (!wsClient.isOpen()) return;

        for (String symbol : symbols) {
            if (subscribedSymbols.add(symbol)) {
                wsClient.send(String.format("""
                    {
                        "method": "subscribe",
                        "params": {
                            "channel": "ticker",
                            "symbol": ["%s"]
                        }
                    }
                    """, symbol));
            }
        }
    }

    public void unsubscribeFromSymbols(String... symbols) {
        if (!wsClient.isOpen()) return;

        for (String symbol : symbols) {
            if (subscribedSymbols.remove(symbol)) {
                wsClient.send(String.format("""
                    {
                        "method": "unsubscribe",
                        "params": {
                            "channel": "ticker",
                            "symbol": ["%s"]
                        }
                    }
                        """, symbol));
                currentPrices.remove(symbol);
                CryptoPriceDataResponce priceData = new CryptoPriceDataResponce();
                priceData.setSymbol(symbol);
                messagingTemplate.convertAndSend("/prices", priceData);
            }
        }
    }

    @PreDestroy
    public void disconnect() {
        if (wsClient != null && wsClient.isOpen()) {
            wsClient.close();
        }
    }

    public Optional<BigDecimal> getCurrentPrice(String symbol) {
        return Optional.ofNullable(currentPrices.get(symbol));
    }
} 