import { DataProcessing } from "@/data-processing";
import { Payments } from "@/payments";
import { Paynow } from "@/paynow";
import { Refunds } from "@/refunds";
import { describe, expect, it } from "vitest";

describe("Paynow", () => {
  const paynow = new Paynow({
    apiKey: "test",
    secret: "test",
  });

  it("Uses the correct base url", () => {
    expect(Reflect.get(paynow, "API_URL")).toBe("https://api.paynow.pl/");

    const sandbox = new Paynow({
      apiKey: "test",
      secret: "test",
      isSandbox: true,
    });

    expect(Reflect.get(sandbox, "API_URL")).toBe(
      "https://api.sandbox.paynow.pl/",
    );
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
});
