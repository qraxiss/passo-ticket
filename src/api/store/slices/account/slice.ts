import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { account, accountState, status } from "./types";
import { Strapi } from "@strapi/strapi";

export let actions;
export let reducer;
export let slice;
export const selector = (state: RootState) => state.account as accountState;
export default async ({ strapi }: { strapi: Strapi }) => {
  const accounts: account[] = (
    await strapi.db.query("api::passo.account").findMany()
  ).map((account) => ({
    status: "login-queue",
    localStorage: null,
    email: account.email,
    password: account.password,
  }));
  slice = createSlice({
    name: "account",
    initialState: {
      accounts,
    },
    reducers: {
      setStatus(
        state: accountState,
        {
          payload: { email, status },
        }: PayloadAction<{ email: string; status: status }>
      ) {
        const itemIndex = state.accounts.findIndex(
          (account) => account.email === email
        );
        if (itemIndex === -1) {
          return;
        }
        state.accounts[itemIndex].status = status;
      },

      setAccounts(
        state: accountState,
        { payload: accounts }: PayloadAction<account[]>
      ) {
        state.accounts = accounts;
      },

      setLocalStorage(
        state: accountState,
        {
          payload: { localStorage, email },
        }: PayloadAction<{ localStorage: any; email: string }>
      ) {
        const itemIndex = state.accounts.findIndex(
          (account) => account.email === email
        );
        if (itemIndex === -1) {
          return;
        }
        state.accounts[itemIndex].status = "active";
        state.accounts[itemIndex].localStorage = localStorage;
      },
    },
  });

  actions = slice.actions;
  reducer = slice.reducer;
  return slice;
};
