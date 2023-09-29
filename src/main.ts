import Knex from "knex";

import {
  CreatePersonController,
  type CreatePersonRequest,
  FindOnePersonController,
  type FindOnePersonRequest,
  FindPersonController,
  type FindPersonRequest,
  UpdatePersonController,
  type UpdatePersonRequest,
  CreateProductController,
  type CreateProductRequest,
  FindOneProductController,
  type FindOneProductRequest,
  FindProductController,
  type FindProductRequest,
  UpdateProductController,
  type UpdateProductRequest,
  CreateSessionController,
  type CreateSessionRequest,
  CreateTeamController,
  type CreateTeamRequest,
  FindOneTeamController,
  type FindOneTeamRequest,
  FindTeamController,
  type FindTeamRequest,
  UpdateTeamController,
  type UpdateTeamRequest,
  CreateUserController,
  type CreateUserRequest,
} from "./application/controllers";

import {
  AccessTokenDecorator,
  type AccessTokenRequest,
} from "./application/decorators";

import { JWT } from "./application/utils";
import { AjvValidationAdapter } from "./infrastructure/ajv";

import { env } from "./infrastructure/env";

import {
  PersonKnexRepository,
  ProductKnexRepository,
  TeamKnexRepository,
  UserKnexRepository,
} from "./infrastructure/knex";

import { adapt } from "./infrastructure/serverless/serverless-controller-adapter";

import type { Controller } from "./application/protocols";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

const knex = Knex({ client: "pg", connection: env.POSTGRES_URL });
const jwt = new JWT(env.SECRET);
const userKnexRepository = new UserKnexRepository(knex);
const productKnexRepository = new ProductKnexRepository(knex);
const teamKnexRepository = new TeamKnexRepository(knex);
const personKnexRepository = new PersonKnexRepository(knex);

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

export const findPeople: APIGatewayProxyHandlerV2 = adapt(
  auth(
    new FindPersonController(
      new AjvValidationAdapter<FindPersonRequest>({
        type: "object",
        required: ["query"],
        properties: {
          query: {
            type: "object",
            properties: {
              name: { type: "string", maxLength: 24, nullable: true },
              teamId: { type: "string", pattern: "[0-9]+", nullable: true },
            },
          },
        },
      }),
      personKnexRepository,
      personKnexRepository,
    ),
  ),
);

export const findOnePerson: APIGatewayProxyHandlerV2 = adapt(
  auth(
    new FindOnePersonController(
      new AjvValidationAdapter<FindOnePersonRequest>({
        type: "object",
        required: ["params"],
        properties: {
          params: {
            type: "object",
            required: ["personId"],
            properties: {
              personId: { type: "string", pattern: "[0-9]+" },
            },
          },
        },
      }),
      personKnexRepository,
    ),
  ),
);

export const createPerson: APIGatewayProxyHandlerV2 = adapt(
  auth(
    new CreatePersonController(
      new AjvValidationAdapter<CreatePersonRequest>({
        type: "object",
        required: ["body"],
        properties: {
          body: {
            type: "object",
            required: ["name", "teamId"],
            properties: {
              name: { type: "string", minLength: 1, maxLength: 24 },
              teamId: { type: "integer", minimum: 1 },
            },
          },
        },
      }),
      teamKnexRepository,
      personKnexRepository,
    ),
  ),
);

export const updatePerson: APIGatewayProxyHandlerV2 = adapt(
  auth(
    new UpdatePersonController(
      new AjvValidationAdapter<UpdatePersonRequest>({
        type: "object",
        required: ["params", "body"],
        properties: {
          params: {
            type: "object",
            required: ["personId"],
            properties: {
              personId: { type: "string", pattern: "[0-9]+" },
            },
          },
          body: {
            type: "object",
            required: ["name", "teamId"],
            properties: {
              name: { type: "string", minLength: 1, maxLength: 24 },
              teamId: { type: "integer", minimum: 1 },
            },
          },
        },
      }),
      teamKnexRepository,
      personKnexRepository,
    ),
  ),
);
