import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from "react";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

import { CryptoPriceData } from "../lib/crypto";

interface CryptoPriceContextType {
  prices: Record<string, CryptoPriceData>;
  loading: boolean;
  error: string | null;
  subscribeToPair: (symbol: string) => void;
  unsubscribeFromPair: (symbol: string) => void;
}

const CryptoPriceContext = createContext<CryptoPriceContextType | undefined>(
  undefined
);

interface CryptoPriceProviderProps {
  children: ReactNode;
}

const socketUrl = import.meta.env.VITE_WEB_SOCKET_URL;

export function CryptoPriceProvider({ children }: CryptoPriceProviderProps) {
  const [prices, setPrices] = useState<Record<string, CryptoPriceData>>({});
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subscribedPairs = useRef(new Set<string>());
  const pendingSubscriptions = useRef(new Set<string>());

  const processPendingSubscriptions = useCallback((client: Client) => {
    pendingSubscriptions.current.forEach((symbol) => {
      if (!subscribedPairs.current.has(symbol)) {
        subscribedPairs.current.add(symbol);
        client.publish({
          destination: "/app/subscribe",
          body: symbol,
        });
      }
    });
    pendingSubscriptions.current.clear();
  }, []);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => {
        return new SockJS(socketUrl);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      setLoading(false);
      setError(null);
      setStompClient(client);

      client.subscribe("/prices", (message) => {
        const priceData = JSON.parse(message.body) as CryptoPriceData;
        setPrices((prev) => ({
          ...prev,
          [priceData.symbol]: priceData,
        }));
      });

      processPendingSubscriptions(client);
    };

    client.onStompError = (frame) => {
      console.error(frame);
      setError("Connection error occurred");
      setLoading(false);
    };

    client.activate();

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [processPendingSubscriptions]);

  const subscribeToPair = useCallback(
    (symbol: string) => {
      if (!stompClient?.active) {
        pendingSubscriptions.current.add(symbol);
        return;
      }

      if (!subscribedPairs.current.has(symbol)) {
        subscribedPairs.current.add(symbol);
        stompClient.publish({
          destination: "/app/subscribe",
          body: symbol,
        });
      }
    },
    [stompClient]
  );

  const unsubscribeFromPair = useCallback(
    (symbol: string) => {
      if (!stompClient?.active) return;
      if (subscribedPairs.current.has(symbol)) {
        subscribedPairs.current.delete(symbol);
        stompClient.publish({
          destination: "/app/unsubscribe",
          body: symbol,
        });
      }
    },
    [stompClient]
  );

  const value = {
    prices,
    loading,
    error,
    subscribeToPair,
    unsubscribeFromPair,
  };

  return (
    <CryptoPriceContext.Provider value={value}>
      {children}
    </CryptoPriceContext.Provider>
  );
}

export function useCryptoPrice() {
  const context = useContext(CryptoPriceContext);
  if (context === undefined) {
    throw new Error("useCryptoPrice must be used within a CryptoPriceProvider");
  }
  return context;
}
