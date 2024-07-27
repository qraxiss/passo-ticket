import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./slices";

export let store;

export async function createStore({ strapi }) {
  store = configureStore({
    reducer: await rootReducer({ strapi }),
  });
  return store;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
