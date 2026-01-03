import { cryptoClient } from "../../index";

export const PaymentService = {
  async createInvoice(
    amount: number,
    asset: string,
    description: string,
    paidBtnUrl: string | "https://t.me/devdigger",
  ) {
    return cryptoClient.createInvoice({
      amount,
      asset,
      description,
      paidBtnUrl,
    });
  },
};
