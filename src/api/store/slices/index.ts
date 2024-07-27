import { combineReducers } from "@reduxjs/toolkit";
import accountSlice from "./account/slice";
import proxySlice from "./proxy/slice";

const rootReducer = async ({ strapi }) => {
  await Promise.all([accountSlice({ strapi }), proxySlice({ strapi })]);

  return combineReducers({
    account: require("./account/slice").reducer,
    proxy: require("./proxy/slice").reducer,
  });
};

export default rootReducer;
