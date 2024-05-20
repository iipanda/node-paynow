import { describe, expect, it } from "vitest";
import { hello } from "./utils";

describe("utils", () => {
  it("should return the correct message", () => {
    expect(hello()).toBe("Hello from Node.js + TypeScript!");
  });
});
