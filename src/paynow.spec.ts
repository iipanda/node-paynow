import { describe, it, expect, beforeAll } from "vitest";
import { Paynow } from "./paynow";
import { Payments } from "./payments";

describe("Paynow", () => {
  let paynow: Paynow;

  beforeAll(() => {
    paynow = new Paynow({
      apiKey: "test",
      secret: "test",
    });
  });

  it("exposes the payments object", () => {
    expect(paynow.payments).toBeDefined();
    expect(paynow.payments).toBeInstanceOf(Payments);
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
});
