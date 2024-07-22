export default {
  beforeCreate(event) {
    const {
      params: { data },
    } = event;
    const userInfo = strapi
      .service("api::passo.account")
      .fetchAccountDetails(data);

    console.log(userInfo);
  },
};
