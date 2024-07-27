import { WebDriver, Builder, By } from "selenium-webdriver";
import { Strapi } from "@strapi/strapi";

async function sendEmail(driver: WebDriver, email: string): Promise<void> {
  await driver
    .findElement(
      By.xpath(
        "/html/body/app-root/app-layout/app-login/section/div/div/div/div/div[2]/div/div/div[1]/div/quick-form/div/quick-input[1]/input"
      )
    )
    .sendKeys(email);
}

async function sendPassword(
  driver: WebDriver,
  password: string
): Promise<void> {
  await driver
    .findElement(
      By.xpath(
        "/html/body/app-root/app-layout/app-login/section/div/div/div/div/div[2]/div/div/div[1]/div/quick-form/div/quick-input[2]/input"
      )
    )
    .sendKeys(password);
}

async function refreshCaptcha(driver: WebDriver): Promise<void> {
  await driver
    .findElement(
      By.xpath(
        "/html/body/app-root/app-layout/app-login/section/div/div/div/div/div[2]/div/div/div[1]/div/quick-form/div/div[1]/div[1]/img[2]"
      )
    )
    .click();
}

async function solveCaptcha(driver: WebDriver): Promise<string> {
  const captchaElement = await driver.findElement(
    By.xpath(
      "/html/body/app-root/app-layout/app-login/section/div/div/div/div/div[2]/div/div/div[1]/div/quick-form/div/div[1]/div[1]/img[1]"
    )
  );
  const captchaSrc = await captchaElement.getAttribute("src");

  const solvedCaptcha = await strapi
    .service("api::passo.account")
    .resolveCaptca(captchaSrc);

  return solvedCaptcha;
}

async function sendCaptcha(
  driver: WebDriver,
  solvedCaptcha: string
): Promise<void> {
  await driver
    .findElement(
      By.xpath(
        "/html/body/app-root/app-layout/app-login/section/div/div/div/div/div[2]/div/div/div[1]/div/quick-form/div/div[1]/div[2]/quick-input/input"
      )
    )
    .clear();
  await driver
    .findElement(
      By.xpath(
        "/html/body/app-root/app-layout/app-login/section/div/div/div/div/div[2]/div/div/div[1]/div/quick-form/div/div[1]/div[2]/quick-input/input"
      )
    )
    .sendKeys(solvedCaptcha);
}

async function checkIsCaptchaFalse(driver: WebDriver): Promise<boolean> {
  try {
    const okButton = await driver.findElement(
      By.xpath("/html/body/div[2]/div/div[3]/button[1]")
    );
    await okButton.click();
    return true;
  } catch (error) {
    return false;
  }
}

async function clickLogin(driver: WebDriver): Promise<void> {
  await driver
    .findElement(
      By.xpath(
        "/html/body/app-root/app-layout/app-login/section/div/div/div/div/div[2]/div/div/div[1]/div/quick-form/div/div[3]/button[2]"
      )
    )
    .click();
}

async function checkLoginStatus(driver: WebDriver): Promise<boolean> {
  return (await driver.getCurrentUrl()) === "https://www.passo.com.tr/tr";
}

async function getAccessToken(driver: WebDriver): Promise<string> {
  const accessToken = (await driver.executeScript(
    "return localStorage.getItem('storage_token');"
  )) as string | null;
  return accessToken;
}

async function login(driver: WebDriver, email: string, password: string) {
  await driver.get("https://www.passo.com.tr/tr/giris");
  await driver.sleep(500);

  await Promise.all([sendEmail(driver, email), sendPassword(driver, password)]);

  // captcha
  do {
    await refreshCaptcha(driver);
    await sendCaptcha(driver, await solveCaptcha(driver));
    await clickLogin(driver);
  } while (await checkIsCaptchaFalse(driver));

  await driver.sleep(500);
  if (await checkLoginStatus(driver)) {
    return await getAccessToken(driver);
  }

  return null;
}

export default ({ strapi }: { strapi: Strapi }) =>
  async (email: string, password: string) => {
    let driver: WebDriver;
    try {
      driver = await new Builder().forBrowser("chrome").build();
      const accessToken = await login(driver, email, password);
      return accessToken;
    } catch (error) {
      console.log(error);
    } finally {
      await driver.quit();
    }

    return null;
  };
