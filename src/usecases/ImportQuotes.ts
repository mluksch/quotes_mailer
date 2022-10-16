import { QuotesFetcher } from "../stores/quotesFetcher/interface/QuotesFetcher";
import { QuotesStorer } from "../stores/quotesStorage/interface/QuotesStorer";

export class ImportQuotes<INPUT> {
  constructor(
    private quotesFetcher: QuotesFetcher<INPUT>,
    private quoteStorer: QuotesStorer
  ) {}

  async execute(input: INPUT) {
    const quotes = await this.quotesFetcher.fetchQuotes(input);
    await this.quoteStorer.storeQuotes(quotes);
  }
}
