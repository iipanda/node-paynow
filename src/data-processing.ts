import { HTTPError, type KyInstance } from "ky";

type DataProcessingNotice = {
  title: string;
  content: string;
  locale: string;
};

export class DataProcessing {
  constructor(private readonly api: KyInstance) {}

  async getDataProcessingNotices(
    locale?: "pl-PL" | "en-GB" | "uk-UA",
  ): Promise<DataProcessingNotice[]> {
    const headers = locale ? { Locale: locale } : {};

    const notices = await this.api
      .get("/v1/payments/dataprocessing/notices", { headers })
      .json<DataProcessingNotice[]>()
      .catch(async error => {
        if (error instanceof HTTPError) {
          throw new PaynowError(
            `Received HTTP error from Paynow: ${error.response.status}`,
          );
        }

        throw error;
      });

    return notices;
  }
}
