export type accountState = {
  accounts: account[] | null;
};

export type status =
  | "invalid-credentials"
  | "active"
  | "token-expired"
  | "login-queue"
  | "logging-in";

export type account = {
  email: string;
  password: string;
  status: status;
  localStorage: {
    LOCALIZE_DEFAULT_LANGUAGE: string;
    storage_isConsentLogin: string;
    storage_faq_seo_title: string;
    storage_homepage_seo_description: string;
    storage_forget_password_seo_title: string;
    storage_homepage_seo_title: string;
    storage_faq_seo_description: string;
    storage_refresh_token: string;
    storage_expire_token_date: string;
    storage_forget_password_seo_description: string;
    storage_register_seo_description: string;
    storage_login_seo_description: string;
    storage_token: string;
    TS00000000076: string;
    storage_active_ticket_type: string;
    lastExternalReferrer: string;
    lastExternalReferrerTime: string;
    storage_register_seo_title: string;
    TSPD_74: string;
    storage_login_seo_title: string;
    storage_modal3: string;
  };
};
