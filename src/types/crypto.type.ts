type CreateCheckOptions = {
  amount: number | string;
  asset: CryptoCurrencyCode;
  pinToUserId?: number;
  pinToUsername?: string;
};
type FiatCurrencyCode =
  | "USD"
  | "EUR"
  | "RUB"
  | "BYN"
  | "UAH"
  | "GBP"
  | "CNY"
  | "KZT"
  | "UZS"
  | "GEL"
  | "TRY"
  | "AMD"
  | "THB"
  | "INR"
  | "BRL"
  | "IDR"
  | "AZN"
  | "AED"
  | "PLN"
  | "ILS"
  | "KGS"
  | "TJS";

type PaidBtnName = "viewItem" | "openChannel" | "openBot" | "callback";

export type CreateInvoiceOptions = {
  amount: number | string;
  acceptedAssets?: CryptoCurrencyCode[];
  asset?: CryptoCurrencyCode;
  currencyType?: "Crypto" | "Fiat";
  description?: string;
  expiresIn?: number;
  fiat?: FiatCurrencyCode;
  hiddenMessage?: string;
  isAllowAnonymous?: boolean;
  isAllowComments?: boolean;
  paidBtnName?: PaidBtnName;
  paidBtnUrl?: string;
  payload?: any;
  swapTo?: SwappableTargetCurrencies;
};
type SwappableTargetCurrencies =
  | "USDT"
  | "TON"
  | "TRX"
  | "ETH"
  | "SOL"
  | "BTC"
  | "LTC";

type CryptoCurrencyCode =
  | "USDT"
  | "TON"
  | "GRAM"
  | "NOT"
  | "MY"
  | "DOGS"
  | "BTC"
  | "LTC"
  | "ETH"
  | "BNB"
  | "TRX"
  | "WIF"
  | "USDC"
  | "TRUMP"
  | "MELANIA"
  | "SOL"
  | "DOGE"
  | "PEPE"
  | "BONK"
  | "MAJOR"
  | "HMSTR"
  | "CATI"
  | "MEMHASH";
