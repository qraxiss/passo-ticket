import { Strapi } from "@strapi/strapi";
import { WebDriver } from "selenium-webdriver";
import { openPage } from "./helpers";

const localStorage = (data: any) => {
  return `
  function setLocalStorage(data) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        localStorage.setItem(key, data[key]);
      }
    }
  }
  
  const data = ${data};
  
  setLocalStorage(data);
  
  return {...localStorage};
  `;
};

export default ({ strapi }: { strapi: Strapi }) =>
  async (token: any, driver: WebDriver) => {
    const data = JSON.stringify(token);
    await openPage(
      driver,
      "/html/body/app-root/app-layout/app-header/div[1]/nav/a/img",
      "https://www.passo.com.tr/tr"
    );
    return await driver.executeScript(localStorage(data));
  };
