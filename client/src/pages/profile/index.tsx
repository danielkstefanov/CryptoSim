import { useEffect, useState } from "react";

import { holdingsService } from "../../services/holdings";
import { ordersService } from "../../services/orders";
import { usersService } from "../../services/users";

import { OrdersContainer } from "../../components/orders-container";
import Button from "../../components/button";

import { User } from "../../lib/users";
import { Holding } from "../../lib/holding";
import { Order } from "../../lib/orders";

import styles from "./styles.module.css";

export function Profile() {
  const [user, setUser] = useState<User>();
  const [holdings, setHoldings] = useState<Holding[]>();
  const [orders, setOrders] = useState<Order[]>();
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setUser(await usersService.getProfileInfo());
      setHoldings(await holdingsService.getHoldings());
      setOrders(await ordersService.getOrders());
    };

    fetchData();
  }, [isResetting]);

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileInfoContainer}>
        <h1>Profile Info</h1>
        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
        <p>Balance: ${user?.balance}</p>

        <Button
          onClick={async () => {
            await usersService.resetUser();
            setIsResetting((prev) => !prev);
          }}
          variant="secondary"
        >
          Reset User
        </Button>
      </div>

      <div className={styles.portfolioHoldingsContainer}>
        <h1>Portfolio</h1>

        {holdings?.length === 0 ? (
          <p>No holdings yet</p>
        ) : (
          <table className={styles.portfolioHoldingsTable}>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {holdings?.map((holding) => (
                <tr key={holding.symbol}>
                  <td>{holding.symbol}</td>
                  <td>{holding.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {!orders ? <p>No orders yet</p> : <OrdersContainer orders={orders} />}
    </div>
  );
}
