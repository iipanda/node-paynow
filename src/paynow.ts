import ky, { type KyInstance } from "ky";
import { Payments } from "./payments";
import { DataProcessing } from "./data-processing";
import { Refunds } from "./refunds";
import { Notifications } from "./notifications";

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
  public readonly refunds: Refunds;
  public readonly notifications: Notifications;

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
    this.refunds = new Refunds(options, this.api);
    this.notifications = new Notifications(options);
  }
}
