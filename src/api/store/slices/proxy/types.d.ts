export type proxyState = {
  proxies: proxy[] | null;
};

export type proxy = {
  host: string;
  protocol: string;
  port: number;
};
