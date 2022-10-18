import { QuotesFetcher } from "./interface/QuotesFetcher";
import * as pp from "papaparse";
import { Quote } from "@usecases/domain/Quote";
import axios from "axios";

export class CsvFileQuoteFetcher implements QuotesFetcher<{ url: string }> {
  constructor(
    private quoteMapper: (dataItem: {
      QUOTE: string;
      AUTHOR: string;
      GENRE: string;
    }) => Quote = (dataItem) => ({
      author: dataItem.AUTHOR ?? "",
      genre: dataItem.GENRE ?? "",
      text: dataItem.QUOTE,
    })
  ) {}

  async fetchQuotes(input: { url: string }): Promise<Quote[]> {
    const response = await axios.get(input.url);
    const csvContent = response.data;
    const results = pp.parse<{
      QUOTE: string;
      AUTHOR: string;
      GENRE: string;
    }>(csvContent, {
      header: true,
      delimiter: ";",
    });
    return results.data.map(this.quoteMapper);
  }
}
