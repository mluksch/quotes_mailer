import { Quote } from "@usecases/domain/Quote";

export interface QuotesFetcher<INPUT> {
  fetchQuotes: (input: INPUT) => Promise<Quote[]>;
}
