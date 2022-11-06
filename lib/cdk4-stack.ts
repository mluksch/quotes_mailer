import * as cdk from "aws-cdk-lib";
import {Duration, RemovalPolicy} from "aws-cdk-lib";
import {Construct} from "constructs";
import {Runtime} from "aws-cdk-lib/aws-lambda";
import * as esbuild from "esbuild";
import * as path from "path";
import {AttributeType, BillingMode} from "aws-cdk-lib/aws-dynamodb";

const TABLE_QUOTES = "quotes";

export class Cdk4Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    esbuild.buildSync({
      outdir: "dist",
      bundle: true,
      sourcemap: true,
      target: "node16",
      platform: "node",
      entryPoints: [
        path.join(__dirname, "..", "src", "query.ts"),
        path.join(__dirname, "..", "src", "import.ts"),
        path.join(__dirname, "..", "src", "sendMail.ts"),
      ],
    });

    const importLambda = new cdk.aws_lambda.Function(this, "import-lambda", {
      runtime: Runtime.NODEJS_16_X,
      handler: "import.handler",
      code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, "..", "dist")),
      timeout: Duration.seconds(60),
      memorySize: 10240,
      environment: {
        TABLE_QUOTES,
      },
    });

    const lambda = new cdk.aws_lambda.Function(this, "lambda", {
      runtime: Runtime.NODEJS_16_X,
      handler: "query.handler",
      code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, "..", "dist")),
      timeout: Duration.seconds(5),
      memorySize: 128,
      environment: {
        TABLE_QUOTES,
      },
    });

    const secret = cdk.aws_secretsmanager.Secret.fromSecretNameV2(
      this,
      "mail-sender-secret",
      "quotes_mailer"
    );
    const lambdaMailer = new cdk.aws_lambda.Function(this, "lambdamailer", {
      runtime: Runtime.NODEJS_16_X,
      handler: "sendmail.handler",
      code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, "..", "dist")),
      timeout: Duration.seconds(5),
      memorySize: 128,
      environment: {
        TABLE_QUOTES,
        MAIL_ARN: secret.secretArn,
      },
    });
    secret.grantRead(lambdaMailer);

    const tableQuotes = new cdk.aws_dynamodb.Table(this, "quotes", {
      billingMode: BillingMode.PAY_PER_REQUEST,
      tableName: TABLE_QUOTES,
      removalPolicy: RemovalPolicy.DESTROY,
      partitionKey: {
        name: "id",
        type: AttributeType.NUMBER,
      },
    });
    tableQuotes.grantReadData(lambda);
    tableQuotes.grantReadData(lambdaMailer);
    tableQuotes.grantWriteData(importLambda);

    const rule = new cdk.aws_events.Rule(this, "rule-mailer", {
      enabled: true,
      ruleName: "rule-mailer",
      targets: [
        new cdk.aws_events_targets.LambdaFunction(lambdaMailer, {
          event: cdk.aws_events.RuleTargetInput.fromObject({ message: "hi" }),
        }),
      ],
      // Utc: 8:00
      schedule: cdk.aws_events.Schedule.cron({
        month: "*",
        year: "*",
        day: "*",
        hour: "6",
        minute: "0",
      }),
    });
    cdk.aws_events_targets.addLambdaPermission(rule, lambdaMailer);

    const restApi = new cdk.aws_apigateway.RestApi(this, "rest", {
      deployOptions: {
        stageName: "test",
      },
    });
    restApi.root
      .addResource("quote")
      .addMethod("get", new cdk.aws_apigateway.LambdaIntegration(lambda));
    restApi.root
      .addResource("mail")
      .addMethod("get", new cdk.aws_apigateway.LambdaIntegration(lambdaMailer));
  }
}
