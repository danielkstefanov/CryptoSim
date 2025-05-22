import clsx from "clsx";

import { ComponentProps } from "react";

import styles from "./styles.module.css";

interface InputProps extends Omit<ComponentProps<"input">, "onChange"> {
  onChange: (value: number | string) => void;
  label?: string;
  errors?: string[];
  className?: string;
}

export default function Input({
  label,
  errors,
  onChange,
  className,
  ...props
}: InputProps) {
  return (
    <>
      {label && <label className={styles.inputLabel}>{label}:</label>}
      {errors && (
        <span className={styles.inputErrors}>{errors.join(", ")}</span>
      )}
      <input
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className={clsx(styles.input, className)}
        {...props}
      />
    </>
  );
}
