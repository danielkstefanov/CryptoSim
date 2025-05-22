package com.cryptosim.service;

import com.cryptosim.model.Holding;
import com.cryptosim.repository.HoldingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class HoldingService {
    private final HoldingRepository holdingRepository;

    public HoldingService(HoldingRepository holdingRepository) {
        this.holdingRepository = holdingRepository;
    }

    public List<Holding> getUserHoldings(Long userId) {
        return holdingRepository.findByUserId(userId);
    }

    public Optional<Holding> getUserHoldingBySymbol(Long userId, String symbol) {
        return holdingRepository.findByUserIdAndSymbol(userId, symbol);
    }

    @Transactional
    public void updateHolding(Long userId, String symbol, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            holdingRepository.deleteByUserIdAndSymbol(userId, symbol);
        } else {
            holdingRepository.updateAmount(userId, symbol, amount);
        }
    }

    public int deleteAllHoldings(Long userId) {
        return holdingRepository.deleteAllByUserId(userId);
    }
} 