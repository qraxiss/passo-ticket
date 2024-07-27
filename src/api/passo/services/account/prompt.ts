export const PROMPT = (base64: string) => {
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
