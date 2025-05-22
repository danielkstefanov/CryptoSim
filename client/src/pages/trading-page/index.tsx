import { CryptoPriceContainer } from "../../components/crypto-price-container";

import { TOP_20_CRYPTO_PAIRS } from "../../lib/constants/crypto-pairs";

import styles from "./styles.module.css";

export function TradingPage() {
  return (
    <div className={styles.tradingPage}>
      <CryptoPriceContainer cryptoPairs={TOP_20_CRYPTO_PAIRS} preview={false} />
    </div>
  );
}
