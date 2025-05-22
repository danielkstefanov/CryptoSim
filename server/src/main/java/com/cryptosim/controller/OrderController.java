package com.cryptosim.controller;

import com.cryptosim.dto.requests.OrderRequest;
import com.cryptosim.model.Order;
import com.cryptosim.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/buy")
    public ResponseEntity<Order> buyOrder(
            @Valid @RequestBody OrderRequest request,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        Order order = orderService.createBuyOrder(userId, request);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/sell")
    public ResponseEntity<Order> sellOrder(
            @Valid @RequestBody OrderRequest request,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        Order order = orderService.createSellOrder(userId, request);
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders(
            Authentication authentication,
            @RequestParam(name = "symbol", required = false) String symbol) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());

        List<Order> orders = symbol != null 
            ? orderService.getUserOrdersBySymbol(userId, symbol)
            : orderService.getUserOrders(userId);
        
        return ResponseEntity.ok(orders);
    }
} 