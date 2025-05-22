import { useState } from "react";
import { Link } from "react-router-dom";

import styles from "./styles.module.css";

interface NavigationMenuProps {
  isUserLoggedIn: Boolean;
}
export default function NavigationMenu({
  isUserLoggedIn,
}: NavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.navigation}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={styles.menuButton}
      >
        Nav Menu ▾
      </button>
      <div className={`${styles.dropdown} ${isOpen ? styles.open : ""}`}>
        <Link className={styles.link} to="/" onClick={() => setIsOpen(false)}>
          Home Page
        </Link>
        {isUserLoggedIn && (
          <>
            <Link
              className={styles.link}
              to="/trading"
              onClick={() => setIsOpen(false)}
            >
              Trading Platform
            </Link>

            <Link
              className={styles.link}
              to="/profile"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
