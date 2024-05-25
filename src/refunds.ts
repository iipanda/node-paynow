import { HTTPError, type KyInstance } from "ky";
import { type PaynowOptions } from "./paynow";
import { Signature } from "./signature";
import { PaynowError } from "./error";

type CreateRefundData = {
  idempotencyKey: string;
  paymentId: string;
  amount: number;
  reason?: "RMA" | "REFUND_BEFORE_14" | "REFUND_AFTER_14" | "OTHER";
};

type CreateRefundResponse = {
  refundId: string;
  status: "NEW" | "PENDING" | "SUCCESSFUL";
};

type RefundStatusResponse = {
  refundId: string;
  status: "NEW" | "PENDING" | "SUCCESSFUL" | "FAILED";
  failureReason?: "CARD_BALANCE_ERROR" | "BUYER_ACCOUNT_CLOSED" | "OTHER";
};

export class Refunds {
  constructor(
    private readonly options: PaynowOptions,
    private readonly api: KyInstance,
  ) {}

  async createRefund({
    idempotencyKey,
    paymentId,
    ...body
  }: CreateRefundData): Promise<CreateRefundResponse> {
    const signature = new Signature(this.options, JSON.stringify(body));

    const refund = await this.api
      .post(`v1/payments/${paymentId}/refunds`, {
        headers: {
          Signature: signature.get(),
          "Idempotency-Key": idempotencyKey,
        },
        json: body,
      })
      .json<CreateRefundResponse>()
      .catch(async error => {
        if (error instanceof HTTPError) {
          throw new PaynowError(
            `Received HTTP error from Paynow: ${error.response.status}`,
          );
        }

        throw error;
      });

    return refund;
  }

  async getRefundStatus(refundId: string): Promise<RefundStatusResponse> {
    const refund = await this.api
      .get(`v1/refunds/${refundId}/status`)
      .json<RefundStatusResponse>()
      .catch(async error => {
        if (error instanceof HTTPError) {
          throw new PaynowError(
            `Received HTTP error from Paynow: ${error.response.status}`,
          );
        }

        throw error;
      });

    return refund;
  }

  async cancelRefund(refundId: string): Promise<void> {
    await this.api
      .post(`v1/refunds/${refundId}/cancel`)
      .json<void>()
      .catch(async error => {
        if (error instanceof HTTPError) {
          throw new PaynowError(
            `Received HTTP error from Paynow: ${error.response.status}`,
          );
        }

        throw error;
      });
  }
}
