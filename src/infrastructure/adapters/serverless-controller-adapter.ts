import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";

import { Controller, Request } from "../../application/protocols";
import { removeUndefined } from "../utils";

export function adapt(controller: Controller) {
  return async function handler(
    event: APIGatewayProxyEventV2,
  ): Promise<APIGatewayProxyStructuredResultV2> {
    const request: Request = {
      headers: removeUndefined(event.headers),
      params: removeUndefined(event.pathParameters ?? {}),
      query: removeUndefined(event.queryStringParameters ?? {}),
      body: event.body !== undefined ? JSON.parse(event.body) : {},
    };

    const response = await controller.handle(request);

    if (response.body === undefined) {
      return { statusCode: response.statusCode };
    }

    const body = JSON.stringify(response.body);

    return {
      statusCode: response.statusCode,
      headers: {
        "content-type": "application/json",
        "content-length": Buffer.byteLength(body, "utf-8"),
      },
      body,
    };
  };
}
