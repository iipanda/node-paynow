import ky, { type KyInstance } from "ky";
import { Payments } from "./payments";
import { DataProcessing } from "./data-processing";

export type PaynowOptions = {
  isSandbox?: boolean;
  apiKey: string;
  secret: string;
};

export class Paynow {
  private readonly API_URL: string;
  private readonly api: KyInstance;

  public readonly payments: Payments;
  public readonly dataProcessing: DataProcessing;

  constructor(private readonly options: PaynowOptions) {
    this.API_URL = options.isSandbox
      ? "https://api.sandbox.paynow.pl/"
      : "https://api.paynow.pl/";

    this.api = ky.create({
      prefixUrl: this.API_URL,
      retry: 0,
      headers: {
        "Api-Key": options.apiKey,
      },
    });

    this.payments = new Payments(options, this.api);
    this.dataProcessing = new DataProcessing(this.api);
  }
}
