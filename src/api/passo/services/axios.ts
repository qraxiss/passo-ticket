import axios from "axios";

const client = axios.create({
  baseURL: "https://ticketingweb.passo.com.tr/api/passoweb",
});

export default ({ strapi }) => ({
  client: () => client,
});
