import { QuotePicker } from "../stores/quotesStorage/interface/QuotePicker";
import { QuoteSender } from "../stores/quoteSender/interface/QuoteSender";

export class SendQuoteViaMail {
  constructor(
    private quotePicker: QuotePicker,
    private quoteSender: QuoteSender
  ) {}

  async execute(mailReceiver: string) {
    const quote = await this.quotePicker.pickAQuote();
    await this.quoteSender.sendQuote(quote, mailReceiver);
  }
}
