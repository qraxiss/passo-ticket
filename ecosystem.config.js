module.exports = {
  apps: [
    {
      name: "develop",
      script: "yarn strapi develop",
    },
    {
      name: "start",
      script: "yarn strapi start",
    },
    {
      name: "admin",
      script: "yarn strapi develop --watch-admin",
    },
  ],
};
