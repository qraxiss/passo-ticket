import { OpenAI } from "openai";
import { PROMPT } from "./prompt";
import { loginSelenium, setTokenSelenium } from "./selenium";
import { selector, actions } from "../../../store/slices/account/slice";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_TOKEN,
});

export default ({ strapi }) => ({
  setLocalStorage(localStorage: any, email: string): Promise<void> {
    return strapi
      .service("api::store.store")
      .dispatch(actions.setLocalStorage({ localStorage, email }));
  },
  async resolveCaptca(base64: string): Promise<string> {
    const data = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: PROMPT(base64) as any,
      max_tokens: 300,
    });
    return data.choices[0].message.content;
  },
  login: loginSelenium({ strapi }),
  setToken: setTokenSelenium({ strapi }),

  accounts() {
    return selector(strapi.service("api::store.store").getState());
  },
});
