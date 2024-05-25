import { z } from "zod";
import { PaynowError } from "./error";
import { type PaynowOptions } from "./paynow";
import { Signature } from "./signature";

const notificationSchema = z.object({
  payload: z.object({
    paymentId: z.string().min(1),
    externalId: z.string().min(1),
    status: z.enum([
      "NEW",
      "PENDING",
      "CONFIRMED",
      "REJECTED",
      "ERROR",
      "EXPIRED",
      "ABANDONED",
    ]),
  }),
  headers: z.object({
    Signature: z.string().min(1),
  }),
});

type Notification = z.infer<typeof notificationSchema>["payload"];

export class Notifications {
  constructor(private readonly options: PaynowOptions) {}

  parseAndValidate(notification: {
    payload: unknown;
    headers: unknown;
  }): Notification {
    const result = notificationSchema.safeParse(notification);
    if (!result.success) {
      throw new PaynowError("Malformed notification");
    }

    const {
      payload,
      headers: { Signature: incomingSignature },
    } = result.data;

    const signature = new Signature(this.options, JSON.stringify(payload));

    if (signature.get() !== incomingSignature) {
      throw new PaynowError("Invalid signature");
    }

    return payload;
  }
}
