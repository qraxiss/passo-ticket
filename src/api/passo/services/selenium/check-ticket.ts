import { Strapi } from "@strapi/strapi";
//@ts-ignore
import { WebDriver, By, Select } from "selenium-webdriver";
import { openPage, waitElement } from "./helpers";

const buyButtonXpath =
  "/html/body/app-root/app-layout/app-event/section[1]/div/div/div/div/div[2]/div[4]/button";

async function openEventPage(driver: WebDriver, path: string) {
  await openPage(
    driver,
    buyButtonXpath,
    `https://passo.com.tr/tr/etkinlik/${path}`
  );
}

async function checkTryAgain(driver: WebDriver) {
  const text = "Daha Sonra Tekrar Deneyiniz";

  const buyButton = driver.findElement(By.xpath(buyButtonXpath));

  return (await buyButton.getText()) === text;
}

async function scrollToDown(driver: WebDriver, px: number) {
  return await driver.executeScript(`window.scrollTo(0, ${px});`);
}

async function clickButton(driver: WebDriver) {
  const buyButton = driver.findElement(By.xpath(buyButtonXpath));
  await scrollToDown(driver, 650);
  await driver.sleep(300);
  try {
    await buyButton.click();
  } catch (error) {
    console.log(error);
  }
}

async function chooseTicketType(driver: WebDriver) {
  const eTicketXpath =
    "/html/body/app-root/app-layout/app-seat/div/div/div[3]/div/div[2]/div[2]/div[3]/div[1]/div/div/div";
  await waitElement(driver, eTicketXpath, 10000);

  await scrollToDown(driver, 550);

  await driver.findElement(By.xpath(eTicketXpath)).click();
}

async function selectCategory(driver: WebDriver, category: string) {
  const selectElement = await waitElement(
    driver,
    "/html/body/app-root/app-layout/app-seat/div/div/div[3]/div/div[2]/div[4]/div[3]/div/select",
    10000
  );

  const select = new Select(selectElement);

  await select.selectByVisibleText(category);
}

export default ({ strapi }: { strapi: Strapi }) =>
  async (driver: WebDriver, path: string) => {
    do {
      await openEventPage(driver, path);
    } while (await checkTryAgain(driver));

    await clickButton(driver);
    await chooseTicketType(driver);
    await selectCategory(driver, " FIRTINA - ₺700 ");
    await driver.sleep(10000);
  };
