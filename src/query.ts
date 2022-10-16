import { APIGatewayProxyHandler } from "aws-lambda";
import { PickAQuote } from "./usecases/PickAQuote";
import { DynamoDbQuotesStorer } from "./stores/quotesStorage/DynamoDbQuotesStorer";

const TABLE_QUOTES = process.env.TABLE_QUOTES;

export const handler: APIGatewayProxyHandler = async () => {
  const quotePicker = new DynamoDbQuotesStorer(TABLE_QUOTES!);
  const usecase = new PickAQuote(quotePicker);
  const quote = await usecase.execute();

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quote),
  };
};
