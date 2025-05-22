import { BrowserRouter, Route, Routes } from "react-router-dom";

import UserProvider from "../contexts/user-context";
import UserPreferencesProvider from "../contexts/user-preferences-context";
import { CryptoPriceProvider } from "../contexts/crypto-price-context";

import { PublicOutlet } from "../outlets/public-outlet";
import { PrivateOutlet } from "../outlets/private-outlet";

import Home from "../pages/home";
import { Register } from "../pages/register";
import NotFoundPage from "../pages/not-found-page";
import { Login } from "../pages/login";

import Header from "../components/header";
import Footer from "../components/footer";
import styles from "./styles.module.css";

import "../app.css";
import { TradingPage } from "../pages/trading-page";
import { TradingTickerDetailsPage } from "../pages/trading-ticker-details-page";
import { Profile } from "../pages/profile";

export default function App() {
  return (
    <CryptoPriceProvider>
      <UserPreferencesProvider>
        <div className={styles.app}>
          <div className={styles.mainContent}>
            <UserProvider>
              <BrowserRouter>
                <Header />

                <Routes>
                  <Route path="/" element={<Home />} />

                  <Route element={<PrivateOutlet />}>
                    <Route path="/profile" element={<Profile />} />
                  </Route>

                  <Route element={<PublicOutlet />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                  </Route>

                  <Route path="/trading" element={<PrivateOutlet />}>
                    <Route index element={<TradingPage />} />
                    <Route
                      path=":symbol"
                      element={<TradingTickerDetailsPage />}
                    />
                  </Route>

                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </BrowserRouter>
            </UserProvider>
          </div>

          <Footer />
        </div>
      </UserPreferencesProvider>
    </CryptoPriceProvider>
  );
}
