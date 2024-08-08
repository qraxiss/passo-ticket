import { WebDriver, By, WebElement } from "selenium-webdriver";

export async function openPage(
  driver: WebDriver,
  xpath: string,
  url: string
): Promise<void> {
  await driver.get(url);
  await waitElement(driver, xpath, 10000);
}

export async function waitElement(
  driver: WebDriver,
  xpath: string,
  ms: number
) {
  const start = new Date().getTime();
  let element: WebElement;
  await driver.wait(async () => {
    try {
      element = await driver.findElement(By.xpath(xpath));
      return true;
    } catch (error) {
      const now = new Date().getTime();
      if (now - start >= ms) {
        throw new Error("Timeout");
      }

      return false;
    }
  });

  return element;
}
