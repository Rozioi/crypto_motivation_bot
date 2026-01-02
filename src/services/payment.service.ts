import { cryptoClient } from "../../index";

export const PaymentService = {
  async createInvoice(amount: number, asset: string, description: string) {
    return cryptoClient.createInvoice({
      amount,
      asset,
      description,
    });
  },
};
