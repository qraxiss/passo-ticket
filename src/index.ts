import { Strapi } from "@strapi/strapi";
import { accountSelector } from "./api/store/slices/account/slice";
export default {
  async register({ strapi }: { strapi: Strapi }) {},
  async bootstrap({ strapi }: { strapi: Strapi }) {
    await strapi.service("api::store.store").createStore();

    const { email, password } = accountSelector(
      strapi.service("api::store.store").getState()
    ).accounts[0];

    const localStorage = await strapi
      .service("api::passo.account")
      .login(email, password);

    strapi.service("api::passo.account").setLocalStorage(localStorage, email);

    console.log(
      accountSelector(strapi.service("api::store.store").getState()).accounts[0]
    );
  },
};
