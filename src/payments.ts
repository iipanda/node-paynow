import { HTTPError, type KyInstance } from "ky";
import { type PaynowOptions } from "./paynow";
import { Signature } from "./signature";
import { PaynowError } from "./error";

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
  paymentMethodId?: number;
  authorizationCode?: string;
};

type PaymentStatusResponse = {
  paymentId: string;
  status:
    | "NEW"
    | "PENDING"
    | "CONFIRMED"
    | "EXPIRED"
    | "REJECTED"
    | "ERROR"
    | "ABANDONED";
};

type PaymentMethod = {
  id: number;
  name: string;
  description?: string;
  image: string;
  status?: "ENABLED" | "DISABLED";
  authorizationType?: "REDIRECT" | "CODE";
};

type PaymentMethodsResponse = {
  type: "BLIK" | "PBL" | "CARD";
  paymentMethods: PaymentMethod[];
}[];

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

    console.log("!!!!!!!!!", {
      json: JSON.stringify(data),
      headers: {
        Signature: signature.get(),
        "Idempotency-Key": idempotencyKey,
      },
    });

    const payment = await this.api
      .post("v1/payments", {
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

    console.log("CREATED PAYMENT", payment);
    return payment;
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    const payment = await this.api
      .get(`v1/payments/${paymentId}/status`)
      .json<PaymentStatusResponse>()
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

  async getPaymentMethods(): Promise<PaymentMethodsResponse> {
    const paymentMethods = await this.api
      .get("v2/payments/paymentmethods")
      .json<PaymentMethodsResponse>()
      .catch(async error => {
        if (error instanceof HTTPError) {
          throw new PaynowError(
            `Received HTTP error from Paynow: ${error.response.status}`,
          );
        }

        throw error;
      });

    return paymentMethods;
  }
}
