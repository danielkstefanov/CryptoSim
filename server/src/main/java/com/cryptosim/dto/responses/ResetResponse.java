package com.cryptosim.dto.responses;

public class ResetResponse {
    private final int deletedOrders;
    private final int deletedHoldings;

    public ResetResponse(int deletedOrders, int deletedHoldings) {
        this.deletedOrders = deletedOrders;
        this.deletedHoldings = deletedHoldings;
    }

    public int getDeletedOrders() {
        return deletedOrders;
    }

    public int getDeletedHoldings() {
        return deletedHoldings;
    }
} 