import { QuoteSender } from "./interface/QuoteSender";
import { Quote } from "@usecases/domain/Quote";
import axios from "axios";
import qs = require("qs");

export class QuoteMailgunSender implements QuoteSender {
  constructor(props: {
    mailApiKey: string;
    mailApiUrl: string;
    mailSender: string;
  }) {
    this.mailApiUrl = props.mailApiUrl;
    this.mailApiKey = props.mailApiKey;
    this.mailSender = props.mailSender;
  }

  private readonly mailApiKey: string;
  private readonly mailApiUrl: string;
  private readonly mailSender: string;

  async sendQuote(quote: Quote, mailReceiver: string): Promise<void> {
    const payload = {
      from: this.mailSender,
      to: mailReceiver,
      subject: "Quote of the day",
      text: `Quote of the day
      
${quote.text}
      
${quote.author ?? ""}
`,
    };
    await axios.post(`${this.mailApiUrl}/messages`, qs.stringify(payload), {
      auth: {
        username: "api",
        password: this.mailApiKey,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  }
}
