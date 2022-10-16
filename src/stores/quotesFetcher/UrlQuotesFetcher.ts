import { QuotesFetcher } from "./interface/QuotesFetcher";
import axios from "axios";
import { Quote } from "@usecases/domain/Quote";

export class UrlQuotesFetcher implements QuotesFetcher<{ url: string }> {
  constructor(
    private quoteMapper: (dataItem: any) => Quote = (dataItem) => dataItem
  ) {}

  async fetchQuotes(input: { url: string }): Promise<Quote[]> {
    const response = await axios.get(input.url);
    return response.data.map(this.quoteMapper);
  }
}
