import clsx from "clsx";

import { CryptoPriceData } from "../../lib/crypto";
import { formatCurrency } from "../../lib/formatters";

import styles from "./styles.module.css";

interface DetailsCryptoCardProps {
  data: CryptoPriceData;
}

export function DetailsCryptoCard({ data }: DetailsCryptoCardProps) {
  return (
    <div className={styles.priceCard}>
      <div className={styles.mainPrice}>
        <h2>Current Price</h2>
        <div className={styles.price}>{formatCurrency(data.price)}</div>

        <div
          className={`${styles.change} ${
            data.changePct >= 0 ? styles.positive : styles.negative
          }`}
        >
          {data.changePct >= 0 ? "↑" : "↓"}{" "}
          {Math.abs(data.changePct).toFixed(2)}%
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <label>24h High</label>
          <div>{formatCurrency(data.high)}</div>
        </div>
        <div className={styles.statItem}>
          <label>24h Low</label>
          <div>{formatCurrency(data.low)}</div>
        </div>
        <div className={clsx(styles.statItem)}>
          <label>24h Change</label>
          <div>{formatCurrency(data.change)}</div>
        </div>
      </div>
    </div>
  );
}
