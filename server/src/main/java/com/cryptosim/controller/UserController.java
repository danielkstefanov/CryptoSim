package com.cryptosim.controller;
    
import com.cryptosim.dto.responses.UserResponse;
import com.cryptosim.dto.responses.ResetResponse;
import com.cryptosim.repository.UserRepository;
import com.cryptosim.exception.ValidationException;
import com.cryptosim.service.OrderService;
import com.cryptosim.service.HoldingService;
import java.math.BigDecimal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.cryptosim.model.User;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    private final OrderService orderService;
    private final HoldingService holdingService;

    @Value("${user.initial.balance}")
    private BigDecimal initialBalance;

    public UserController(UserRepository userRepository, OrderService orderService, HoldingService holdingService) {
        this.userRepository = userRepository;
        this.orderService = orderService;
        this.holdingService = holdingService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ValidationException("User not found"));
        return ResponseEntity.ok(UserResponse.fromUser(user));
    }

    @PostMapping("/reset")
    public ResponseEntity<ResetResponse> resetUser(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        int deleteOrdersCount = orderService.deleteAllOrders(userId);
        int deleteHoldingsCount = holdingService.deleteAllHoldings(userId);
        userRepository.updateBalance(userId, initialBalance);
        return ResponseEntity.ok(new ResetResponse(deleteOrdersCount, deleteHoldingsCount));
    }
} 