import { Quote } from "@usecases/domain/Quote";

export interface QuotePicker {
  pickAQuote(): Promise<Quote>;
}
