import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { proxyState, proxy } from "./types";
import { Strapi } from "@strapi/strapi";

export let actions;
export let reducer;
export let slice;
export const proxySelector = (state: RootState) => state.proxy;

export default async ({ strapi }: { strapi: Strapi }) => {
  const proxies: proxy[] = (
    await strapi.db.query("api::passo.proxy").findMany({
      populate: {
        protocol: true,
      },
    })
  ).map((proxy) => ({
    host: proxy.host,
    port: proxy.port,
    protocol: proxy.protocol.protocol,
  }));
  slice = createSlice({
    name: "proxy",
    initialState: {
      proxies,
    },
    reducers: {},
  });

  actions = slice.actions;
  reducer = slice.reducer;
  return slice;
};
