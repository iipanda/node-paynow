import { describe, it, expect, beforeAll } from "vitest";
import { Paynow } from "./paynow";
import { Payments } from "./payments";
import { DataProcessing } from "./data-processing";
import { Refunds } from "./refunds";

describe("Paynow", () => {
  let paynow: Paynow;

  beforeAll(() => {
    paynow = new Paynow({
      apiKey: "test",
      secret: "test",
    });
  });

  it("uses the correct base url", () => {
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

  it("exposes the Payments class", () => {
    expect(paynow.payments).toBeDefined();
    expect(paynow.payments).toBeInstanceOf(Payments);
  });

  it("exposes the DataProcessing class", () => {
    expect(paynow.dataProcessing).toBeDefined();
    expect(paynow.dataProcessing).toBeInstanceOf(DataProcessing);
  });

  it("exposes the Refunds class", () => {
    expect(paynow.refunds).toBeDefined();
    expect(paynow.refunds).toBeInstanceOf(Refunds);
  });
});
