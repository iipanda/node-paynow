import { describe, it, expect } from "vitest";
import { Signature } from "./signature";

describe("Signature", () => {
  it("generates the correct signature", () => {
    const signature = new Signature(
      { secret: "b305b996-bca5-4404-a0b7-2ccea3d2b64b" },
      JSON.stringify(
        {
          amount: "12345",
          externalId: "12345",
          description: "Payment description",
          buyer: {
            email: "jan.kowalski@melements.pl",
          },
        },
        null,
        4,
      ),
    );

    expect(signature.get()).toBe(
      "jWTXPRQNokQ4eD63rYWTW1uHDsmsmygYN2xDj8Pl8Ic=",
    );
  });
});
