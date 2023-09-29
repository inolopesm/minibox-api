import type { Controller, Request } from "../../application/protocols";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

const removeUndefined = (
  object: Record<string, string | undefined>,
): Record<string, string> =>
  Object.fromEntries(
    Object.entries(object).reduce<Array<[string, string]>>(
      (array, [key, value]) =>
        value !== undefined ? [...array, [key, value]] : array,
      [],
    ),
  );

export const adapt =
  (controller: Controller): APIGatewayProxyHandlerV2 =>
  async (event) => {
    const request: Request = {
      headers: removeUndefined(event.headers),
      params: removeUndefined(event.pathParameters ?? {}),
      query: removeUndefined(event.queryStringParameters ?? {}),
      body: event.body !== undefined ? JSON.parse(event.body) : {},
    };

    const response = await controller.handle(request);

    return {
      statusCode: response.statusCode,
      ...(response.body !== undefined
        ? {
            headers: { "content-type": "application/json" },
            body: JSON.stringify(response.body),
          }
        : {}),
    };
  };
