import { Strapi } from "@strapi/strapi";
import { WebDriver, Builder } from "selenium-webdriver";

export default ({ strapi }: { strapi: Strapi }) => ({
  async createDriver() {
    let driver: WebDriver;
    try {
      driver = await new Builder().forBrowser("chrome").build();
      return driver;
    } catch (error) {
      driver?.quit();
      throw error;
    }
  },
});
