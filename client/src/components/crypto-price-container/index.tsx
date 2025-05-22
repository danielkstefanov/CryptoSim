import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { useCryptoPrice } from "../../contexts/crypto-price-context";

import { TickerCard } from "../ticker-card";
import Input from "../input";

import styles from "./styles.module.css";

interface CryptoPriceContainerProps {
  cryptoPairs: string[];
  preview?: boolean;
}

export function CryptoPriceContainer({
  cryptoPairs,
  preview = false,
}: CryptoPriceContainerProps) {
  const { prices, error, subscribeToPair, unsubscribeFromPair } =
    useCryptoPrice();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    cryptoPairs.forEach((symbol) => {
      subscribeToPair(symbol);
    });

    return () => {
      cryptoPairs.forEach((symbol) => {
        unsubscribeFromPair(symbol);
      });
    };
  }, [cryptoPairs, subscribeToPair, unsubscribeFromPair]);

  return (
    <div className={styles.cryptoPriceTracker}>
      <div className={styles.tradingHeader}>
        <h2 className={styles.title}>
          Top {cryptoPairs.length} Cryptocurrencies
        </h2>

        {!preview && (
          <Input
            key="tickerInputField"
            type="text"
            value={searchText}
            onChange={(value) => {
              setSearchParams((prev) => {
                prev.set("search", value.toString());
                return prev;
              });
              setSearchText(value.toString());
            }}
            placeholder="Search ticker"
          />
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.priceGrid}>
        {cryptoPairs.map((symbol, index) => {
          if (
            searchText &&
            !symbol.toLowerCase().includes(searchText.toLowerCase())
          ) {
            return null;
          }

          return (
            <TickerCard
              position={index + 1}
              key={symbol}
              symbol={symbol}
              data={prices[symbol]}
              preview={preview}
            />
          );
        })}
      </div>
    </div>
  );
}
