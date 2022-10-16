import { Quote } from "@usecases/domain/Quote";

export interface QuotesStorer {
  storeQuotes(quotes: Quote[]): Promise<void>;
}
