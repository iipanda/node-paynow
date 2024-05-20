import { type PaynowOptions } from "./paynow";
import crypto from "node:crypto";

export class Signature {
  constructor(
    private readonly options: PaynowOptions,
    private readonly payload: string,
  ) {}

  public get(): string {
    return crypto
      .createHmac("sha256", this.options.secret)
      .update(this.payload)
      .digest("base64");
  }
}
