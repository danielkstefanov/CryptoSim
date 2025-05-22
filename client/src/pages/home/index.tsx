import { Link } from "react-router-dom";

import Button from "../../components/button";
import { CryptoPriceContainer } from "../../components/crypto-price-container";
import { TOP_3_CRYPTO_PAIRS } from "../../lib/constants/crypto-pairs";

import styles from "./styles.module.css";

export default function Home() {
  return (
    <div className={styles.imageBackground}>
      <div className={styles.homePage}>
        <div className={styles.info}>
          <div>
            <h2 className={styles.title}>Welcome to CryptoSim 📈</h2>
            <p>
              CryptoSim is your gateway to mastering cryptocurrency trading in a
              risk-free environment. Perfect for both beginners and experienced
              traders, our platform lets you practice trading strategies with
              virtual currency using real-time market data. Build your
              confidence, test your strategies, and learn the ins and outs of
              crypto trading without risking real money.
            </p>
          </div>
          <div>
            <Button variant="secondary">
              <Link className={styles.link} to="/trading">
                Launch Trading Platform
              </Link>
            </Button>
          </div>
        </div>
        <div>
          <CryptoPriceContainer
            cryptoPairs={TOP_3_CRYPTO_PAIRS}
            preview={true}
          />
        </div>
      </div>
    </div>
  );
}
