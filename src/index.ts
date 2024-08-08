import { Strapi } from "@strapi/strapi";
export default {
  async register({ strapi }: { strapi: Strapi }) {},
  async bootstrap({ strapi }: { strapi: Strapi }) {
    await strapi.service("api::store.store").createStore();
  },
};
