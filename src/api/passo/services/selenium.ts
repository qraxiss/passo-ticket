import login from "./selenium/login";
import setToken from "./selenium/set-token";
import checkTicket from "./selenium/check-ticket";
import { Strapi } from "@strapi/strapi";
import { WebDriver, Builder } from "selenium-webdriver";
export default ({ strapi }: { strapi: Strapi }) => ({
  setToken: setToken({ strapi }),
  login: login({ strapi }),
  checkTicket: checkTicket({ strapi }),
  async createDriver() {
    let driver: WebDriver;
    try {
      driver = await new Builder().forBrowser("chrome").build();
      return driver;
    } catch (error) {
      throw error;
    }
  },

  async quit(driver: WebDriver) {
    try {
      return await driver.quit();
    } catch (error) {
      console.log(error);
    }
  },
});
