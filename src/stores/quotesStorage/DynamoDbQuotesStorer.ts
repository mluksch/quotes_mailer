import { QuotesStorer } from "./interface/QuotesStorer";
import { Quote } from "@usecases/domain/Quote";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QuotePicker } from "./interface/QuotePicker";
import * as _ from "lodash";

export class DynamoDbQuotesStorer implements QuotesStorer, QuotePicker {
  constructor(private quoteTableName: string) {
    this.db = DynamoDBDocumentClient.from(
      new DynamoDBClient({
        apiVersion: "latest",
      }),
      {
        marshallOptions: {
          removeUndefinedValues: true,
          convertEmptyValues: false,
        },
        unmarshallOptions: {
          wrapNumbers: false,
        },
      }
    );
  }

  private db: DynamoDBDocumentClient;

  async pickAQuote(): Promise<Quote> {
    const quotesSize = await this.db
      .send(
        new ScanCommand({
          TableName: this.quoteTableName,
          Select: "COUNT",
        })
      )
      .then((result) => result.Count ?? 0);
    const result = await this.db.send(
      new GetCommand({
        TableName: this.quoteTableName,
        Key: {
          id: _.random(0, quotesSize - 1),
        },
      })
    );
    console.log("** result: " + JSON.stringify(result));
    return result.Item as Quote;
  }

  async storeQuotes(quotes: Quote[]): Promise<void> {
    await Promise.all(
      quotes.map((quote, index) =>
        this.db.send(
          new PutCommand({
            Item: {
              id: index,
              ...quote,
            },
            TableName: this.quoteTableName,
          })
        )
      )
    );
  }
}
