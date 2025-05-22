import clsx from "clsx";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useCryptoPrice } from "../../contexts/crypto-price-context";
import { useAsyncAction } from "../../hooks/use-async-action";

import { ordersService } from "../../services/orders";
import { holdingsService } from "../../services/holdings";

import Button from "../../components/button";
import LoadingSpinner from "../../components/loading-spinner";
import Input from "../../components/input";
import { DetailsCryptoCard } from "../../components/details-crypto-card";
import { OrdersContainer } from "../../components/orders-container";

import { ValidationException } from "../../lib/errors/base-errors";
import { Order, OrderType } from "../../lib/orders";
import { formatDecimal } from "../../lib/formatters";

import styles from "./styles.module.css";

export function TradingTickerDetailsPage() {
  const [searchParams] = useSearchParams();
  const symbol = searchParams.get("symbol");
  const navigate = useNavigate();
  const { prices, subscribeToPair, unsubscribeFromPair } = useCryptoPrice();
  const [amount, setAmount] = useState(0);

  const [orders, setOrders] = useState<Order[]>([]);
  const [holding, setHolding] = useState(0);

  const loadDetails = async () => {
    if (!symbol) {
      throw new Error("Symbol is required");
    }

    const loadedOrders = await ordersService.getOrders(symbol);
    setOrders(loadedOrders);
    const loadedHolding = await holdingsService.getHoldingForSymbol(symbol);
    setHolding(loadedHolding);
  };

  useEffect(() => {
    loadDetails();
  }, []);

  const { trigger: onOrder, error: orderError } = useAsyncAction(
    async (orderType: OrderType) => {
      if (!symbol) {
        throw new Error("Symbol is required");
      }

      let newOrder;
      if (orderType === "BUY") {
        newOrder = await ordersService.buy(amount, symbol);
      } else {
        newOrder = await ordersService.sell(amount, symbol);
      }
      setOrders((oldOrders) => [newOrder, ...oldOrders]);
      setHolding(
        (oldHolding) => oldHolding + (orderType === "BUY" ? amount : -amount)
      );
    }
  );

  useEffect(() => {
    if (symbol) {
      subscribeToPair(symbol);
    }

    return () => {
      if (symbol) {
        unsubscribeFromPair(symbol);
      }
    };
  }, [symbol, subscribeToPair, unsubscribeFromPair]);

  if (!symbol || !prices[symbol]) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <Button onClick={() => navigate("/trading")}>← Back</Button>
        <h1 className={styles.title}>{symbol} Details</h1>
      </div>

      <div
        className={clsx(
          styles.mainContainer,
          orders.length > 0 && styles.mainContainerWithOrders
        )}
      >
        <DetailsCryptoCard data={prices[symbol]} />

        <div className={styles.ordersContainer}>
          <div className={styles.tradeForm}>
            <h2>Open a new trade</h2>
            {orderError instanceof ValidationException && (
              <p className={styles.errorMessage}>{orderError.message}</p>
            )}
            <Input
              type="number"
              placeholder="Amount"
              className={styles.tradeFormInput}
              min={0}
              step="0.00001"
              onChange={(amount) => {
                setAmount(Number(amount));
              }}
            />
            <div className={styles.tradeFormButtons}>
              <Button
                type="submit"
                className={styles.buyButton}
                variant="secondary"
                onClick={() => onOrder("BUY")}
              >
                Buy
              </Button>
              <Button
                type="submit"
                className={styles.sellButton}
                variant="destructive"
                onClick={() => onOrder("SELL")}
              >
                Sell
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.symbolHoldingContainer}>
          <h2>
            You currently have {formatDecimal(holding)}{" "}
            {symbol.toUpperCase().split("/")[0]} in your portfolio
          </h2>
        </div>

        {orders.length > 0 && <OrdersContainer orders={orders} />}
      </div>
    </div>
  );
}
