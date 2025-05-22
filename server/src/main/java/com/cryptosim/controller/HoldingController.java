package com.cryptosim.controller;

import com.cryptosim.model.Holding;
import com.cryptosim.service.HoldingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/holdings")
public class HoldingController {
    private final HoldingService holdingService;

    public HoldingController(HoldingService holdingService) {
        this.holdingService = holdingService;
    }

    @GetMapping
    public ResponseEntity<?> getUserHoldingBySymbol(
            Authentication authentication,
            @RequestParam(name = "symbol", required = false) String symbol) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());

        if (symbol == null) {
            List<Holding> holdings = holdingService.getUserHoldings(userId);
            return ResponseEntity.ok(holdings);
        }

        return ResponseEntity.ok(
            holdingService.getUserHoldingBySymbol(userId, symbol)
                .orElse(Holding.emptyHolding(userId, symbol))
        );
    }
} 