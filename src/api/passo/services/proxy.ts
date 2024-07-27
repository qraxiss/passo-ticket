import { Strapi } from "@strapi/strapi";
import { proxySelector } from "../../store/slices/proxy/slice";

export default ({ strapi }: { strapi: Strapi }) => ({
  proxies() {
    return proxySelector(strapi.service("api::store.store").getState());
  },
});
