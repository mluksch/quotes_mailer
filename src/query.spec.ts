import { handler } from "./query";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { Context } from "aws-lambda/handler";

describe("test handler", () => {
  it("returns quote", async () => {
    const event = {} as APIGatewayProxyEvent;
    const ctx = {} as Context;
    const cb = jest.fn();
    const result = await handler(event, ctx, cb);
    expect(result).not.toBeNull();
    expect(result).toEqual(
      expect.objectContaining({
        statusCode: 200,
        body: expect.any(String),
      })
    );
  });
});
