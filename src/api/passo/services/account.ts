import { OpenAI } from "openai";
import { selector, actions } from "../../store/slices/account/slice";

const PROMPT = (base64: string) => {
  return [
    {
      role: "system",
      content:
        "You are a captcha solver image model, solve to captchas and just return text in a captcha image, don't write anything else, dont use spaces. And gave u a little hint, captcha images not contains small letter, every letter is capital or number, not contains small letters. And contains maximum 4 letter.",
    },
    {
      role: "user",
      content: [
        { type: "text", text: "give me the text on this captcha" },
        {
          type: "image_url",
          image_url: {
            url: base64,
          },
        },
      ],
    },
  ];
};

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

  accounts() {
    return selector(strapi.service("api::store.store").getState());
  },
});
