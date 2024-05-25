import { HTTPError, type KyInstance } from "ky";
import { type PaynowOptions } from "./paynow";
import { Signature } from "./signature";

type CreatePaymentResponse = {
  redirectUrl?: string;
  paymentId: string;
  status: "NEW" | "ERROR";
};

type CreatePaymentData = {
  idempotencyKey: string;
  amount: number;
  currency?: "PLN" | "EUR" | "USD" | "GBP" | "CZK";
  externalId: string;
  description: string;
  continueUrl?: string;
  buyer: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: {
      prefix: string;
      number: string;
    };
    locale?: string;
    externalId?: string;
  };
  orderItems?: {
    name: string;
    producer?: string;
    category: string;
    quantity: number;
    price: number;
  }[];
  validityTime?: number;
  payoutAccount?: string;
  paytmentMethodId?: string;
  authorizationCode?: string;
};
export class Payments {
  constructor(
    private readonly options: PaynowOptions,
    private readonly api: KyInstance,
  ) {}

  async createPayment({
    idempotencyKey,
    ...data
  }: CreatePaymentData): Promise<CreatePaymentResponse> {
    const signature = new Signature(this.options, JSON.stringify(data));

    const payment = await this.api
      .post("/v1/payments", {
        headers: {
          Signature: signature.get(),
          "Idempotency-Key": idempotencyKey,
        },
        json: data,
      })
      .json<CreatePaymentResponse>()
      .catch(async error => {
        if (error instanceof HTTPError) {
          throw new PaynowError(
            `Received HTTP error from Paynow: ${error.response.status}`,
          );
        }

        throw error;
      });

    return payment;
  }
}
