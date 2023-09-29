import Ajv from "ajv";
import Knex from "knex";

import {
  CreateProductController,
  type CreateProductRequest,
} from "./application/controllers/products/create-product-controller";

import {
  FindOneProductController,
  type FindOneProductRequest,
} from "./application/controllers/products/find-one-product-controller";

import {
  FindProductController,
  type FindProductRequest,
} from "./application/controllers/products/find-product-controller";

import {
  UpdateProductController,
  type UpdateProductRequest,
} from "./application/controllers/products/update-product-controller";

import {
  CreateSessionController,
  type CreateSessionRequest,
} from "./application/controllers/sessions/create-session-controller";

import {
  CreateTeamController,
  type CreateTeamRequest,
} from "./application/controllers/teams/create-team-controller";

import {
  FindOneTeamController,
  type FindOneTeamRequest,
} from "./application/controllers/teams/find-one-team-controller";

import {
  FindTeamController,
  type FindTeamRequest,
} from "./application/controllers/teams/find-team-controller";

import {
  UpdateTeamController,
  type UpdateTeamRequest,
} from "./application/controllers/teams/update-team-controller";

import {
  CreateUserController,
  type CreateUserRequest,
} from "./application/controllers/users/create-user-controller";

import {
  AccessTokenDecorator,
  type AccessTokenRequest,
} from "./application/decorators/access-token-decorator";

import { JWT } from "./application/utils/jwt";
import { AjvValidationAdapter } from "./infrastructure/ajv/ajv-validation-adapter";
import { ProductKnexRepository } from "./infrastructure/knex/product-knex-repository";
import { TeamKnexRepository } from "./infrastructure/knex/team-knex-repository";
import { UserKnexRepository } from "./infrastructure/knex/user-knex-repository";
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

const env = {
  SECRET: process.env.SECRET as string,
  POSTGRES_URL: process.env.POSTGRES_URL as string,
  API_KEY: process.env.API_KEY as string,
};

if (
  !new Ajv().compile<typeof env>({
    type: "object",
    required: ["SECRET", "POSTGRES_URL", "API_KEY"],
    properties: {
      SECRET: { type: "string" },
      POSTGRES_URL: { type: "string" },
      API_KEY: { type: "string" },
    },
  })(env)
)
  throw new Error("Environment variables validation failed");

const knex = Knex({ client: "pg", connection: env.POSTGRES_URL });
const jwt = new JWT(env.SECRET);
const userKnexRepository = new UserKnexRepository(knex);
const productKnexRepository = new ProductKnexRepository(knex);
const teamKnexRepository = new TeamKnexRepository(knex);

const auth = (controller: Controller): Controller =>
  new AccessTokenDecorator(
    controller,
    new AjvValidationAdapter<AccessTokenRequest>({
      type: "object",
      required: ["headers"],
      properties: {
        headers: {
          type: "object",
          required: ["x-access-token"],
          properties: { "x-access-token": { type: "string" } },
        },
      },
    }),
    jwt,
  );

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

export const findProducts: APIGatewayProxyHandlerV2 = adapt(
  auth(
    new FindProductController(
      new AjvValidationAdapter<FindProductRequest>({
        type: "object",
        required: ["query"],
        properties: {
          query: {
            type: "object",
            properties: {
              name: { type: "string", maxLength: 24, nullable: true },
            },
          },
        },
      }),
      productKnexRepository,
      productKnexRepository,
    ),
  ),
);

export const findOneProduct: APIGatewayProxyHandlerV2 = adapt(
  auth(
    new FindOneProductController(
      new AjvValidationAdapter<FindOneProductRequest>({
        type: "object",
        required: ["params"],
        properties: {
          params: {
            type: "object",
            required: ["productId"],
            properties: {
              productId: { type: "string", pattern: "[0-9]+" },
            },
          },
        },
      }),
      productKnexRepository,
    ),
  ),
);

export const createProduct: APIGatewayProxyHandlerV2 = adapt(
  auth(
    new CreateProductController(
      new AjvValidationAdapter<CreateProductRequest>({
        type: "object",
        required: ["body"],
        properties: {
          body: {
            type: "object",
            required: ["name", "value"],
            properties: {
              name: { type: "string", minLength: 1, maxLength: 24 },
              value: { type: "integer", minimum: 1, maximum: 99999 },
            },
          },
        },
      }),
      productKnexRepository,
    ),
  ),
);

export const updateProduct: APIGatewayProxyHandlerV2 = adapt(
  auth(
    new UpdateProductController(
      new AjvValidationAdapter<UpdateProductRequest>({
        type: "object",
        required: ["params", "body"],
        properties: {
          params: {
            type: "object",
            required: ["productId"],
            properties: {
              productId: { type: "string", pattern: "[0-9]+" },
            },
          },
          body: {
            type: "object",
            required: ["name", "value"],
            properties: {
              name: { type: "string", minLength: 1, maxLength: 24 },
              value: { type: "integer", minimum: 1, maximum: 99999 },
            },
          },
        },
      }),
      productKnexRepository,
    ),
  ),
);

export const findTeams: APIGatewayProxyHandlerV2 = adapt(
  auth(
    new FindTeamController(
      new AjvValidationAdapter<FindTeamRequest>({
        type: "object",
        required: ["query"],
        properties: {
          query: {
            type: "object",
            properties: {
              name: { type: "string", maxLength: 24, nullable: true },
            },
          },
        },
      }),
      teamKnexRepository,
      teamKnexRepository,
    ),
  ),
);

export const findOneTeam: APIGatewayProxyHandlerV2 = adapt(
  auth(
    new FindOneTeamController(
      new AjvValidationAdapter<FindOneTeamRequest>({
        type: "object",
        required: ["params"],
        properties: {
          params: {
            type: "object",
            required: ["teamId"],
            properties: {
              teamId: { type: "string", pattern: "[0-9]+" },
            },
          },
        },
      }),
      teamKnexRepository,
    ),
  ),
);

export const createTeam: APIGatewayProxyHandlerV2 = adapt(
  auth(
    new CreateTeamController(
      new AjvValidationAdapter<CreateTeamRequest>({
        type: "object",
        required: ["body"],
        properties: {
          body: {
            type: "object",
            required: ["name"],
            properties: {
              name: { type: "string", minLength: 1, maxLength: 24 },
            },
          },
        },
      }),
      teamKnexRepository,
    ),
  ),
);

export const updateTeam: APIGatewayProxyHandlerV2 = adapt(
  auth(
    new UpdateTeamController(
      new AjvValidationAdapter<UpdateTeamRequest>({
        type: "object",
        required: ["params", "body"],
        properties: {
          params: {
            type: "object",
            required: ["teamId"],
            properties: {
              teamId: { type: "string", pattern: "[0-9]+" },
            },
          },
          body: {
            type: "object",
            required: ["name"],
            properties: {
              name: { type: "string", minLength: 1, maxLength: 24 },
            },
          },
        },
      }),
      teamKnexRepository,
    ),
  ),
);
