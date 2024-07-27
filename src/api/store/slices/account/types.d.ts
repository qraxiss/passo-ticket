export type accountState = {
  accounts: account[] | null;
};

export type status =
  | "invalid-credentials"
  | "active"
  | "token-expired"
  | "login-queue"
  | "logging-in";

export type account = {
  email: string;
  password: string;
  status: status;
  token: string;
};
