import { DataProcessing } from "@/data-processing";
import { Payments } from "@/payments";
import { Paynow } from "@/paynow";
import { Refunds } from "@/refunds";
import { describe, expect, it, vi } from "vitest";

import ky from "ky";
import { Notifications } from "@/notifications";

const API_KEY = "test";
const SECRET = "test";

describe("Paynow", () => {
  const spy = vi.spyOn(ky, "create");

  const paynow = new Paynow({
    apiKey: API_KEY,
    secret: SECRET,
  });

  it("Initializes the API client properly", () => {
    expect(spy).toHaveBeenLastCalledWith({
      prefixUrl: "https://api.paynow.pl/",
      retry: 0,
      headers: {
        "Api-Key": API_KEY,
      },
    });
  });

  it("Intializes the API client properly for sandbox environment", () => {
    new Paynow({
      apiKey: API_KEY,
      secret: SECRET,
      isSandbox: true,
    });

    expect(spy).toHaveBeenLastCalledWith({
      prefixUrl: "https://api.sandbox.paynow.pl/",
      retry: 0,
      headers: {
        "Api-Key": API_KEY,
      },
    });
  });

  it("Exposes the Payments class", () => {
    expect(paynow.payments).toBeDefined();
    expect(paynow.payments).toBeInstanceOf(Payments);
  });

  it("Exposes the DataProcessing class", () => {
    expect(paynow.dataProcessing).toBeDefined();
    expect(paynow.dataProcessing).toBeInstanceOf(DataProcessing);
  });

  it("Exposes the Refunds class", () => {
    expect(paynow.refunds).toBeDefined();
    expect(paynow.refunds).toBeInstanceOf(Refunds);
  });

  it("Exposes the Notifications class", () => {
    expect(paynow.notifications).toBeDefined();
    expect(paynow.notifications).toBeInstanceOf(Notifications);
  });
});
