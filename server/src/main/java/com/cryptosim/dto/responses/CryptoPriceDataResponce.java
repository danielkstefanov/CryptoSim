package com.cryptosim.dto.responses;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CryptoPriceDataResponce {
    private String symbol;
    private double price;
    private double change;
    private double high;
    private double low;
    private double changePct;

    public CryptoPriceDataResponce() {
    }

    public CryptoPriceDataResponce(String symbol, double price, double change, double high, double low, double changePct) {
        this.setSymbol(symbol);
        this.setPrice(price);
        this.setChange(change);
        this.setHigh(high);
        this.setLow(low);
        this.setChangePct(changePct);
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getChange() {
        return change;
    }

    public void setChange(double change) {
        this.change = change;
    }

    public double getHigh() {
        return high;
    }

    public void setHigh(double high) {
        this.high = high;
    }

    public double getLow() {
        return low;
    }

    public void setLow(double low) {
        this.low = low;
    }

    public double getChangePct() {
        return changePct;
    }

    public void setChangePct(double changePct) {
        this.changePct = changePct;
    }
} 