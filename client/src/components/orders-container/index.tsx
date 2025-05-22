import { Order } from "../../lib/orders";
import { OrderCard } from "../order-card";

import styles from "./styles.module.css";

interface OrdersContainerProps {
  orders: Order[];
}

export function OrdersContainer({ orders }: OrdersContainerProps) {
  return (
    <div className={styles.mainContainer}>
      <h2>Orders history</h2>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div className={styles.ordersContainer}>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
