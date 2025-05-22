package com.cryptosim.controller;

import com.cryptosim.service.KrakenWebSocketService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class CryptoWebSocketController {
    private final KrakenWebSocketService krakenService;

    public CryptoWebSocketController(KrakenWebSocketService krakenService) {
        this.krakenService = krakenService;
    }

    @MessageMapping("/subscribe")
    @SendTo("/prices")
    public void handleSubscription(String symbol) {
        krakenService.subscribeToSymbols(symbol);
    }

    @MessageMapping("/unsubscribe")
    @SendTo("/prices")
    public void handleUnsubscription(String symbol) {
        krakenService.unsubscribeFromSymbols(symbol);
    }
} 