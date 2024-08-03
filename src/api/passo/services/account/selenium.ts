import { WebDriver, By } from "selenium-webdriver";
import { Strapi } from "@strapi/strapi";

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

async function openLoginPage(driver: WebDriver): Promise<void> {
  await driver.get("https://www.passo.com.tr/tr/giris");
  await driver.wait(async () => {
    try {
      await driver.findElement(
        By.xpath(
          "/html/body/app-root/app-layout/app-login/section/div/div/div/div/div[2]/div/div/div[1]/div/quick-form/div/quick-input[1]/input"
        )
      );
      return true;
    } catch (error) {
      return false;
    }
  });
}

async function getLocalStorage(driver: WebDriver): Promise<string> {
  const localStorage = (await driver.executeScript(
    "return {...localStorage};"
  )) as string | null;

  return localStorage;
}

async function login(driver: WebDriver, email: string, password: string) {
  await openLoginPage(driver);
  await sendEmail(driver, email);
  await sendPassword(driver, password);

  while (true) {
    await sendCaptcha(driver, await solveCaptcha(driver));
    try {
      await clickLogin(driver);
    } catch (error) {
      await refreshCaptcha(driver);
      await driver.sleep(300);
      continue;
    }

    await driver.sleep(1000);
    if (await checkIsCaptchaFalse(driver)) {
      await driver.sleep(300);
      await refreshCaptcha(driver);
      await driver.sleep(300);
    } else {
      break;
    }
  }

  await driver.sleep(1000);
  if (await checkLoginStatus(driver)) {
    return await getLocalStorage(driver);
  }

  return null;
}

export const loginSelenium =
  ({ strapi }: { strapi: Strapi }) =>
  async (email: string, password: string, driver: WebDriver) => {
    try {
      return await login(driver, email, password);
    } catch (error) {
      console.log(error);
      return null;
    }
  };

export const setTokenSelenium =
  ({ strapi }: { strapi: Strapi }) =>
  async (token: any, driver: WebDriver) => {
    const data = JSON.stringify(token);
    await openLoginPage(driver);
    return await driver.executeScript(localStorage(data));
  };
