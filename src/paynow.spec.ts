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
});
