import clsx from "clsx";

import { useNavigate } from "react-router-dom";

import { CryptoPriceData } from "../../lib/crypto";
import { formatCurrency } from "../../lib/formatters";

import Button from "../button";

import styles from "./styles.module.css";

interface TickerCardProps {
  symbol: string;
  preview?: boolean;
  data: CryptoPriceData;
  position: number;
}

export function TickerCard({
  symbol,
  data,
  preview = false,
  position,
}: TickerCardProps) {
  const navigate = useNavigate();

  return (
    <div key={symbol} className={styles.priceCard}>
      <h3>
        {position}. {symbol}
      </h3>
      {data ? (
        <table className={styles.priceInfoTable}>
          <thead>
            <tr>
              <th>Price</th>
              <th>24h High</th>
              <th>24h Low</th>
              <th>24h Change</th>
              <th>24h Change %</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{formatCurrency(data.price)}</td>
              <td>{formatCurrency(data.high)}</td>
              <td>{formatCurrency(data.low)}</td>
              <td>
                {data.change > 0 && "+"}
                {formatCurrency(data.change)}
              </td>
              <td>
                <span
                  className={clsx(
                    styles.change,
                    data.changePct >= 0 ? styles.positive : styles.negative
                  )}
                >
                  {data.changePct.toFixed(2)}%
                </span>
              </td>

              {!preview && (
                <td>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      navigate(`/trading/ticker?symbol=${symbol}`);
                    }}
                  >
                    Details
                  </Button>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      ) : (
        <div>Waiting for data...</div>
      )}
    </div>
  );
}
