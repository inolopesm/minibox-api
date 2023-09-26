import Knex from "knex";

import {
  CreateSessionController,
  type CreateSessionRequest,
} from "./application/controllers/sessions/create-session-controller";

import {
  CreateUserController,
  type CreateUserRequest,
} from "./application/controllers/users/create-user-controller";

import { JWT } from "./application/utils/jwt";
import { AjvValidationAdapter } from "./infrastructure/ajv-validation-adapter";
import { UserKnexRepository } from "./infrastructure/user-knex-repository";
import type { Controller, Request } from "./application/protocols/http";
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

const adapt =
  (controller: Controller): APIGatewayProxyHandlerV2 =>
  async (event) => {
    const request: Request = {
      headers: removeUndefined(event.headers),
      path: removeUndefined(event.pathParameters ?? {}),
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

const env = {
  SECRET: process.env.SECRET as string,
  POSTGRES_URL: process.env.POSTGRES_URL as string,
  API_KEY: process.env.API_KEY as string,
};

const knex = Knex({ client: "pg", connection: env.POSTGRES_URL });
const jwt = new JWT(env.SECRET);
const userKnexRepository = new UserKnexRepository(knex);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v3.0! Your function executed successfully!",
        input: event,
      },
      null,
      2,
    ),
  };
};

export const createSession: APIGatewayProxyHandlerV2 = adapt(
  new CreateSessionController(
    new AjvValidationAdapter<CreateSessionRequest>({
      type: "object",
      required: ["body"],
      properties: {
        body: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", minLength: 1, maxLength: 24 },
            password: { type: "string", minLength: 1, maxLength: 24 },
          },
        },
      },
    }),
    userKnexRepository,
    jwt,
  ),
);

export const createUser: APIGatewayProxyHandlerV2 = adapt(
  new CreateUserController(
    new AjvValidationAdapter<CreateUserRequest>({
      type: "object",
      required: ["headers", "body"],
      properties: {
        headers: {
          type: "object",
          required: ["x-api-key"],
          properties: {
            "x-api-key": { type: "string", minLength: 1, maxLength: 255 },
          },
        },
        body: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", minLength: 1, maxLength: 24 },
            password: { type: "string", minLength: 1, maxLength: 24 },
          },
        },
      },
    }),
    env.API_KEY,
    userKnexRepository,
    userKnexRepository,
  ),
);
