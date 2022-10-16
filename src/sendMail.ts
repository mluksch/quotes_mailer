import * as aws from "aws-lambda";
import { SendQuoteViaMail } from "./usecases/SendQuoteViaMail";
import { DynamoDbQuotesStorer } from "./stores/quotesStorage/DynamoDbQuotesStorer";
import { QuoteMailgunSender } from "./stores/quoteSender/QuoteMailgunSender";
import * as awsSdk from "aws-sdk";

const TABLE_QUOTES = process.env.TABLE_QUOTES;
const MAIL_ARN = process.env.MAIL_ARN;

export const handler: aws.ProxyHandler = async () => {
  const manager = new awsSdk.SecretsManager();

  const mailSecrets = await manager
    .getSecretValue({
      SecretId: MAIL_ARN!,
    })
    .promise()
    .then((item) => item.SecretString);
  const secretPayload = JSON.parse(mailSecrets!);

  const quotePicker = new DynamoDbQuotesStorer(TABLE_QUOTES!);
  const quoteSender = new QuoteMailgunSender({
    mailApiKey: secretPayload["mail_api_key"],
    mailApiUrl: secretPayload["mail_api_url"],
    mailSender: secretPayload["mail_sender"],
  });
  const usecase = new SendQuoteViaMail(quotePicker, quoteSender);
  await usecase.execute(secretPayload["mail_receiver"]);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: "ok" }),
  };
};
