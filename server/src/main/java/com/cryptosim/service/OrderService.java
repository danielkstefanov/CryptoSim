package com.cryptosim.service;

import com.cryptosim.dto.requests.OrderRequest;
import com.cryptosim.exception.ValidationException;
import com.cryptosim.model.Order;
import com.cryptosim.model.Holding;
import com.cryptosim.repository.OrderRepository;
import com.cryptosim.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final HoldingService holdingService;
    private final KrakenWebSocketService krakenWebSocketService;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository,
                       HoldingService holdingService, KrakenWebSocketService krakenWebSocketService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.holdingService = holdingService;
        this.krakenWebSocketService = krakenWebSocketService;
    }

    @Transactional
    public Order createBuyOrder(Long userId, OrderRequest request) {
        BigDecimal currentPrice = krakenWebSocketService.getCurrentPrice(request.getSymbol())
            .orElseThrow(() -> new ValidationException("Could not get current price for " + request.getSymbol()));

        BigDecimal totalCost = request.getAmount().multiply(currentPrice);
        
        userRepository.findById(userId).ifPresent(user -> {
            if (user.getBalance().compareTo(totalCost) < 0) {
                throw new ValidationException("Insufficient balance for this purchase. You have $" + user.getBalance() + " and the total cost is $" + totalCost);
            }

            userRepository.updateBalance(user.getId(), user.getBalance().subtract(totalCost));
        });

        holdingService.updateHolding(
            userId,
            request.getSymbol(),
            holdingService.getUserHoldingBySymbol(userId, request.getSymbol())
                .map(holding -> holding.getAmount().add(request.getAmount()))
                .orElse(request.getAmount())
        );

        Order order = new Order(userId, "BUY", request.getSymbol(), request.getAmount(), currentPrice);
        return orderRepository.save(order);
    }

    @Transactional
    public Order createSellOrder(Long userId, OrderRequest request) {
        BigDecimal availableAmount = holdingService.getUserHoldingBySymbol(userId, request.getSymbol())
            .map(Holding::getAmount)
            .orElse(BigDecimal.ZERO);

        if (availableAmount.compareTo(request.getAmount()) < 0) {
            throw new ValidationException("Insufficient " + request.getSymbol() + " balance for this sale. You have " + availableAmount + " and the amount you want to sell is " + request.getAmount());
        }

        BigDecimal currentPrice = krakenWebSocketService.getCurrentPrice(request.getSymbol())
            .orElseThrow(() -> new ValidationException("Could not get current price for " + request.getSymbol()));

        BigDecimal totalValue = request.getAmount().multiply(currentPrice);
        
        userRepository.findById(userId).ifPresent(user -> {
            userRepository.updateBalance(user.getId(), user.getBalance().add(totalValue));
        });

        BigDecimal newAmount = availableAmount.subtract(request.getAmount());
        holdingService.updateHolding(userId, request.getSymbol(), newAmount);

        Order order = new Order(userId, "SELL", request.getSymbol(), request.getAmount(), currentPrice);
        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getUserOrdersBySymbol(Long userId, String symbol) {
        return orderRepository.findByUserIdAndSymbol(userId, symbol);
    }

    public int deleteAllOrders(Long userId) {
        return orderRepository.deleteAllByUserId(userId);
    }
} 