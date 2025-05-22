import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { useAsyncAction } from "../../hooks/use-async-action";

import { authService } from "../../services/auth-service";

import {
  InvalidLoginCredentials,
  ValidationException,
} from "../../lib/errors/base-errors";

import Input from "../../components/input";
import Button from "../../components/button";

import styles from "./styles.module.css";

const initialState = {
  email: "",
  password: "",
};

type LoginState = typeof initialState;

export function Login() {
  const [formState, setFormState] = useState(initialState);

  const changeProp = useCallback(
    <Field extends keyof LoginState>(field: Field) => {
      return (value: string | number) =>
        setFormState((prevState) => ({
          ...prevState,
          [field]: value,
        }));
    },
    []
  );

  const state = useLocation().state as { from: string | null } | null;
  const from = state?.from;
  const navigate = useNavigate();

  const { error, trigger: onSubmit } = useAsyncAction(async () => {
    await authService.login(formState);
    navigate({ pathname: from ?? "/" }, { replace: true });
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className={styles.loginForm}
    >
      <h2 className={styles.title}>Login Form</h2>

      {error instanceof InvalidLoginCredentials && (
        <span className={styles.formErrors}>{error.message}</span>
      )}

      {error instanceof ValidationException && (
        <span className={styles.formErrors}>{error.message}</span>
      )}

      <Input
        type="email"
        onChange={changeProp("email")}
        value={formState.email}
        placeholder="Email"
      />
      <Input
        type="password"
        onChange={changeProp("password")}
        value={formState.password}
        placeholder="Password"
      />

      <Button variant="secondary" type="submit" className={styles.button}>
        Login
      </Button>
    </form>
  );
}
