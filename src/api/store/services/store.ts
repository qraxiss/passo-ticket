/**
 * store service
 */
import { Strapi } from "@strapi/strapi";
import { createStore } from "../store";

export default ({ strapi }: { strapi: Strapi }) => ({
  getStore: () => require("../store").store,
  getActions: () => require("../slices/actions"),
  getState: () => strapi.service("api::store.store").getStore().getState(),
  createStore: () => {
    const store = createStore({ strapi });
    strapi.services["api::store.store"].store = strapi
      .service("api::store.store")
      .getStore();
    strapi.services["api::store.store"].actions = strapi
      .service("api::store.store")
      .getActions();
    return store;
  },
  actions: null,
  store: null,
});
