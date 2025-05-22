import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import Button from "../../components/button";

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Page Not Found!</h1>
      <p className={styles.subtitle}>
        The page you're looking for doesn't exist.
      </p>
      <Button variant="secondary">
        <Link className={styles.homeLink} to="/">
          Home page
        </Link>
      </Button>
    </div>
  );
}
