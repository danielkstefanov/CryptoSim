import { formatCurrency, formatDate } from "../../lib/formatters";
import { Order } from "../../lib/orders";

import styles from "./styles.module.css";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <div className={styles.orderCard}>
      <table className={styles.orderInfoTable}>
        <thead>
          <tr>
            <th>Order Type</th>
            <th>Amount</th>
            <th>Fill Price</th>
            <th>Value</th>
            <th>Filled On</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              className={order.orderType === "BUY" ? styles.buy : styles.sell}
            >
              {order.orderType}
            </td>
            <td>{order.amount}</td>
            <td>{formatCurrency(order.currentPrice, 2)}</td>
            <td>{formatCurrency(order.amount * order.currentPrice, 2)}</td>
            <td>{formatDate(order.createdAt)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
