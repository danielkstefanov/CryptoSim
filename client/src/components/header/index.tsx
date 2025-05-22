import { Link, useNavigate } from "react-router-dom";

import { authService } from "../../services/auth-service";
import { useOptionalUser } from "../../contexts/user-context";

import Button from "../button";
import NavigationMenu from "../navigation-menu";
import ThemeSelector from "../theme-selector";

import styles from "./styles.module.css";

export default function Header() {
  const navigate = useNavigate();
  const user = useOptionalUser();

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.headerTitle}>
        <h1>CryptoSim</h1>
      </Link>

      <NavigationMenu isUserLoggedIn={!!user} />

      <ThemeSelector className={styles.themeSelector} />

      <div className={styles.loggedInHeaderData}>
        {user ? (
          <>
            <h2>{`Hello, ${user.name}!`}</h2>
            <Button variant="secondary" onClick={() => authService.logout()}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button variant="secondary" onClick={() => navigate("/register")}>
              Register
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
