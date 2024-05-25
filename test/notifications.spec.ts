import { PaynowError } from "@/error";
import { Notifications } from "@/notifications";
import { describe, expect, it } from "vitest";

describe("Notifications", () => {
  const notifications = new Notifications({
    apiKey: "12345",
    secret: "12345",
  });

  describe("parseAndValidate", () => {
    it("Valid notification is accepted", () => {
      const notification = {
        payload: {
          paymentId: "12345",
          externalId: "12345",
          status: "NEW",
        },
        headers: {
          Signature: "150TkDUy2V+w8gzsh9m5SGLkczYbDOB18rlHVC6EWRI=",
        },
      };

      const result = notifications.parseAndValidate(notification);

      expect(result).toEqual({
        externalId: "12345",
        paymentId: "12345",
        status: "NEW",
      });
    });

    it("Malformed notification is rejected", () => {
      const notification = {
        payload: {
          payment_id: "12345",
          externalId: "12345",
          statuss: "NEW",
        },
        headers: {
          Signature: "aAOx/ck7XYOZQzO11iUnrA1vHAj0rUd1N+WFnkXlvDM=",
        },
      };

      expect(() => {
        notifications.parseAndValidate(notification);
      }).toThrow(new PaynowError("Malformed notification"));
    });

    it("Notification with invalid signature is rejected", () => {
      const notification = {
        payload: {
          paymentId: "12345",
          externalId: "12345",
          status: "NEW",
        },
        headers: {
          Signature: "12345",
        },
      };

      expect(() => {
        notifications.parseAndValidate(notification);
      }).toThrow(new PaynowError("Invalid signature"));
    });
  });
});
