import { Quote } from "@usecases/domain/Quote";

export interface QuoteSender {
  sendQuote(quote: Quote, mailReceiver: string): Promise<void>;
}
