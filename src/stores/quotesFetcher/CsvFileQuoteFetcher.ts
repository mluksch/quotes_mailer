import { QuotesFetcher } from "./interface/QuotesFetcher";
import * as pp from "papaparse";
import { Quote } from "@usecases/domain/Quote";

export class CsvFileQuoteFetcher
  implements QuotesFetcher<{ csvContent: string }>
{
  constructor(
    private quoteMapper: (dataItem: any) => Quote = (dataItem) => dataItem
  ) {}

  async fetchQuotes(input: { csvContent: string }): Promise<Quote[]> {
    const results = pp.parse<{
      QUOTE: string;
      AUTHOR: string;
      GENRE: string;
    }>(input.csvContent, {
      header: true,
      delimiter: ";",
    });
    return results.data.map(this.quoteMapper);
  }
}
