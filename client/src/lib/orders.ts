export type Order = {
  id: number;
  symbol: string;
  amount: number;
  currentPrice: number;
  orderType: OrderType;
  createdAt: string;
  updatedAt: string;
};

export type OrderType = "BUY" | "SELL";
