import { Builder, By, WebDriver } from "selenium-webdriver";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_TOKEN,
});

async function resolveCaptca(base64: string): Promise<string> {
  const data = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a captcha solver image model, solve to captchas and just return text in a captcha image, don't write anything else, dont use spaces. And gave u a little hint, captcha images not contains small letter, every letter is capital or number, not contains small letters. And contains maximum 4 letter.",
      },
      {
        role: "user",
        content: [
          { type: "text", text: "give me the text on this image" },
          {
            type: "image_url",
            image_url: {
              url: base64,
            },
          },
        ],
      },
    ],
    max_tokens: 300,
  });
  return data.choices[0].message.content;
}

async function updateAccessToken(accessToken: string | null): Promise<void> {
  console.log(accessToken.replace(`"Bearer `, "").replace('"', ""));
}

export default ({ strapi }) => ({
  async fetchAccountDetails(account) {
    const client = strapi.service("api::passo.axios").client();
    const res = await client.get("/getcontact", {
      headers: {
        authorization: `Bearer ${account.token}`,
      },
    });

    return res.data;
  },

  async login(username: string, password: string) {
    let driver: WebDriver = await new Builder().forBrowser("chrome").build();
    try {
      await driver.get("https://www.passo.com.tr/tr/giris");
      await driver.sleep(1000);

      await driver
        .findElement(
          By.xpath(
            "/html/body/app-root/app-layout/app-login/section/div/div/div/div/div[2]/div/div/div[1]/div/quick-form/div/quick-input[1]/input"
          )
        )
        .sendKeys(username);
      await driver
        .findElement(
          By.xpath(
            "/html/body/app-root/app-layout/app-login/section/div/div/div/div/div[2]/div/div/div[1]/div/quick-form/div/quick-input[2]/input"
          )
        )
        .sendKeys(password);

      let captchaElement = await driver.findElement(
        By.xpath(
          "/html/body/app-root/app-layout/app-login/section/div/div/div/div/div[2]/div/div/div[1]/div/quick-form/div/div[1]/div[1]/img[1]"
        )
      );
      let captchaSrc = await captchaElement.getAttribute("src");

      let solvedCaptcha = await resolveCaptca(captchaSrc);

      await driver
        .findElement(
          By.xpath(
            "/html/body/app-root/app-layout/app-login/section/div/div/div/div/div[2]/div/div/div[1]/div/quick-form/div/div[1]/div[2]/quick-input/input"
          )
        )
        .sendKeys(solvedCaptcha);

      await driver
        .findElement(
          By.xpath(
            "/html/body/app-root/app-layout/app-login/section/div/div/div/div/div[2]/div/div/div[1]/div/quick-form/div/div[3]/button[2]"
          )
        )
        .click();

      await driver.sleep(2000);

      if ((await driver.getCurrentUrl()) === "https://www.passo.com.tr/tr") {
        let accessToken = (await driver.executeScript(
          "return localStorage.getItem('storage_token');"
        )) as string | null;
        return accessToken;
      }
    } catch (error) {
      console.log(error);
    } finally {
      await driver.quit();
    }

    return null;
  },
});
