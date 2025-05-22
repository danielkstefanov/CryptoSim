export interface LoginProps {
  email: string;
  password: string;
}

export interface RegisterProps {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export interface User {
  userId: number;
  name: string;
  email: string;
  balance: number;
}
