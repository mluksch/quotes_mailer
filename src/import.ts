import { ProxyHandler } from "aws-lambda";
import { ImportQuotes } from "./usecases/ImportQuotes";
import { UrlQuotesFetcher } from "./stores/quotesFetcher/UrlQuotesFetcher";
import { DynamoDbQuotesStorer } from "./stores/quotesStorage/DynamoDbQuotesStorer";
import { CsvFileQuoteFetcher } from "./stores/quotesFetcher/CsvFileQuoteFetcher";

const TABLE_QUOTES = process.env.TABLE_QUOTES;

const importQuotes1 = async () => {
  const quotesFetcher = new UrlQuotesFetcher(
    (dataItem: { author: string; text: string }) => ({
      ...dataItem,
      genre: "",
    })
  );
  const quotesStorer = new DynamoDbQuotesStorer(TABLE_QUOTES!);

  const usecase = new ImportQuotes(quotesFetcher, quotesStorer);
  await usecase.execute({
    url: "https://raw.githubusercontent.com/dwyl/quotes/main/quotes.json",
  });
};

const importQuotes2 = async () => {
  const quotesFetcher = new CsvFileQuoteFetcher();
  const quotesStorer = new DynamoDbQuotesStorer(TABLE_QUOTES!);

  const usecase = new ImportQuotes(quotesFetcher, quotesStorer);
  await usecase.execute({
    url: "https://raw.githubusercontent.com/akhiltak/inspirational-quotes/master/Quotes.csv",
  });
};

export const handler: ProxyHandler = async () => {
  //await importQuotes1();
  await importQuotes2();
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "ok" }),
  };
};
