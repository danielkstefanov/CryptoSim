import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { authService } from "../../services/auth-service";

import { ValidationException } from "../../lib/errors/base-errors";
import { useAsyncAction } from "../../hooks/use-async-action";

import Button from "../../components/button";
import Input from "../../components/input";

import styles from "./styles.module.css";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const state = useLocation().state as { from: string | null } | null;
  const from = state?.from;
  const navigate = useNavigate();

  const { error, trigger: onSubmit } = useAsyncAction(async () => {
    await authService.register({ name, email, password, repeatPassword });
    navigate({ pathname: from ?? "/" }, { replace: true });
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className={styles.registerForm}
    >
      <h2 className={styles.title}>Register Form</h2>

      {error instanceof ValidationException && (
        <span className={styles.formErrors}>{error.message}</span>
      )}

      <Input
        key="loginUsernameInputField"
        name="name"
        onChange={(e) => setName(e.toString())}
        value={name}
        placeholder="Username"
        className={styles.input}
      />

      <Input
        key="loginEmailInputField"
        name="email"
        type="email"
        onChange={(e) => setEmail(e.toString())}
        value={email}
        placeholder="Email"
        className={styles.input}
      />

      <Input
        key="loginPasswordInputField"
        name="password"
        type="password"
        onChange={(e) => setPassword(e.toString())}
        value={password}
        placeholder="Password"
        className={styles.input}
      />

      <Input
        key="loginRepeatPasswordInputField"
        name="repeatpassword"
        type="password"
        onChange={(e) => setRepeatPassword(e.toString())}
        value={repeatPassword}
        placeholder="Repeat Password"
        className={styles.input}
      />
      <Button variant="secondary" type="submit" className={styles.button}>
        Register
      </Button>
    </form>
  );
}
