import { OpenAI } from "openai";
import { PROMPT } from "./prompt";
import login from "./selenium";
import { accountSelector } from "../../../store/slices/account/slice";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_TOKEN,
});

export default ({ strapi }) => ({
  async updateAccessToken(accessToken: string | null): Promise<void> {
    console.log(accessToken.replace(`"Bearer `, "").replace('"', ""));
  },
  async resolveCaptca(base64: string): Promise<string> {
    const data = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: PROMPT(base64) as any,
      max_tokens: 300,
    });
    return data.choices[0].message.content;
  },
  login: login({ strapi }),

  accounts() {
    return accountSelector(strapi.service("api::store.store").getState());
  },
});
