import { ProxyHandler } from "aws-lambda";
import { ImportQuotes } from "./usecases/ImportQuotes";
import { UrlQuotesFetcher } from "./stores/quotesFetcher/UrlQuotesFetcher";
import { DynamoDbQuotesStorer } from "./stores/quotesStorage/DynamoDbQuotesStorer";

export type Quote = {
  id: number;
  quote: string;
  author?: string | null;
  genre?: string | null;
};

const TABLE_QUOTES = process.env.TABLE_QUOTES;

const QUOTES_URL =
  "https://raw.githubusercontent.com/dwyl/quotes/main/quotes.json";

export const handler: ProxyHandler = async () => {
  const quotesFetcher = new UrlQuotesFetcher();
  const quotesStorer = new DynamoDbQuotesStorer(TABLE_QUOTES!);

  const usecase = new ImportQuotes(quotesFetcher, quotesStorer);
  await usecase.execute({
    url: QUOTES_URL,
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "ok" }),
  };
};
