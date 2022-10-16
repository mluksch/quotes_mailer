import { Quote } from "./domain/Quote";
import { QuotePicker } from "../stores/quotesStorage/interface/QuotePicker";

export class PickAQuote {
  constructor(private quotePicker: QuotePicker) {}

  async execute(): Promise<Quote> {
    return this.quotePicker.pickAQuote();
  }
}
