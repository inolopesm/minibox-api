/* eslint-disable @typescript-eslint/no-floating-promises, @typescript-eslint/no-misused-promises */
import AJV from "ajv";
import Fastify from "fastify";
import FastifyCors from "@fastify/cors";
import Knex from "knex";
import { SessionService } from "./application/services/SessionService";
import { UserRepository } from "./application/repositories/UserRepository";
import { JWT } from "./application/utils/JWT";
import { UserService } from "./application/services/UserService";
import { ProductService } from "./application/services/ProductService";
import { ProductRepository } from "./application/repositories/ProductRepository";

const TWELVE_HOURS_IN_SECONDS = 12 * 60 * 60;

const env = {
  SECRET: process.env.SECRET as string,
  POSTGRES_URL: process.env.POSTGRES_URL as string,
  API_KEY: process.env.API_KEY as string,
};

{
  const schema = {
    type: "object",
    required: ["SECRET", "POSTGRES_URL", "API_KEY"],
    properties: {
      SECRET: { type: "string" },
      POSTGRES_URL: { type: "string" },
      API_KEY: { type: "string" },
    },
  };

  if (!new AJV().compile(schema)(env)) {
    throw new Error("Validation failed on environment variables");
  }
}

const knex = Knex({ client: "pg", connection: env.POSTGRES_URL });

const fastify = Fastify();

fastify.register(FastifyCors);

fastify.route({
  method: "POST",
  url: "/sessions",
  schema: {
    body: {
      type: "object",
      required: ["username", "password"],
      properties: {
        username: { type: "string" },
        password: { type: "string" },
      },
    },
  },
  handler: async (request, reply) => {
    const { username, password } = request.body as {
      username: string;
      password: string;
    };

    const sessionService = new SessionService(
      new UserRepository(knex),
      new JWT(env.SECRET, TWELVE_HOURS_IN_SECONDS),
    );

    const result = await sessionService.create(username, password);

    if (result instanceof Error) {
      reply.status(400);
      reply.send({ message: result.message });
      return;
    }

    reply.status(200);
    reply.send(result);
  },
});

fastify.route({
  method: "POST",
  url: "/users",
  schema: {
    headers: {
      type: "object",
      required: ["x-api-key"],
      properties: {
        "x-api-key": { type: "string" },
      },
    },
    body: {
      type: "object",
      required: ["username", "password", "admin"],
      properties: {
        username: { type: "string" },
        password: { type: "string" },
        admin: { type: "boolean" },
      },
    },
  },
  preHandler: async (request, reply) => {
    const apiKey = request.headers["x-api-key"] as string;

    if (apiKey !== env.API_KEY) {
      reply.status(400);
      reply.send({ message: "Não autorizado" });
    }
  },
  handler: async (request, reply) => {
    const { username, password, admin } = request.body as {
      secret: string;
      username: string;
      password: string;
      admin: boolean;
    };

    const userService = new UserService(new UserRepository(knex));

    const result = await userService.create({
      username,
      password,
      admin,
    });

    if (result instanceof Error) {
      reply.status(400);
      reply.send({ message: result.message });
      return;
    }

    reply.status(200);
    reply.send(result);
  },
});

fastify.route({
  method: "GET",
  url: "/products",
  schema: {
    headers: {
      type: "object",
      required: ["x-access-token"],
      properties: {
        "x-access-token": { type: "string" },
      },
    },
    query: {
      type: "object",
      properties: {
        name: { type: "string" },
      },
    },
  },
  preHandler: async (request, reply) => {
    const accessToken = request.headers["x-access-token"] as string;
    const jwt = new JWT(env.SECRET, TWELVE_HOURS_IN_SECONDS);
    const payloadOrError = jwt.verify(accessToken);

    if (payloadOrError instanceof Error) {
      reply.status(400);
      reply.send({ message: "Não autorizado" });
    }
  },
  handler: async (request) => {
    const { name } = request.query as { name?: string };
    const productService = new ProductService(new ProductRepository(knex));
    return await productService.find(name);
  },
});

fastify.route({
  method: "POST",
  url: "/products",
  schema: {
    headers: {
      type: "object",
      required: ["x-access-token"],
      properties: {
        "x-access-token": { type: "string" },
      },
    },
    body: {
      type: "object",
      required: ["name", "value"],
      properties: {
        name: { type: "string" },
        value: { type: "integer", minimum: 0 },
      },
    },
  },
  preHandler: async (request, reply) => {
    const accessToken = request.headers["x-access-token"] as string;
    const jwt = new JWT(env.SECRET, TWELVE_HOURS_IN_SECONDS);
    const payloadOrError = jwt.verify(accessToken);

    if (payloadOrError instanceof Error) {
      reply.status(400);
      reply.send({ message: "Não autorizado" });
    }
  },
  handler: async (request) => {
    const { name, value } = request.body as { name: string; value: number };
    const productService = new ProductService(new ProductRepository(knex));
    await productService.create(name, value);
  },
});

fastify.route({
  method: "GET",
  url: "/products/:productId",
  schema: {
    headers: {
      type: "object",
      required: ["x-access-token"],
      properties: {
        "x-access-token": { type: "string" },
      },
    },
    params: {
      type: "object",
      required: ["productId"],
      properties: {
        productId: { type: "integer", minimum: 1 },
      },
    },
  },
  preHandler: async (request, reply) => {
    const accessToken = request.headers["x-access-token"] as string;
    const jwt = new JWT(env.SECRET, TWELVE_HOURS_IN_SECONDS);
    const payloadOrError = jwt.verify(accessToken);

    if (payloadOrError instanceof Error) {
      reply.status(400);
      reply.send({ message: "Não autorizado" });
    }
  },
  handler: async (request, reply) => {
    const { productId } = request.params as { productId: number };
    const productService = new ProductService(new ProductRepository(knex));
    const productOrError = await productService.findOne(productId);

    if (productOrError instanceof Error) {
      const error = productOrError;
      reply.status(400);
      reply.send({ message: error.message });
    }

    const product = productOrError;

    reply.status(200);
    reply.send(product);
  },
});

fastify.route({
  method: "PUT",
  url: "/products/:productId",
  schema: {
    headers: {
      type: "object",
      required: ["x-access-token"],
      properties: {
        "x-access-token": { type: "string" },
      },
    },
    params: {
      type: "object",
      required: ["productId"],
      properties: {
        productId: { type: "integer", minimum: 1 },
      },
    },
    body: {
      type: "object",
      required: ["name", "value"],
      properties: {
        name: { type: "string" },
        value: { type: "integer", minimum: 0 },
      },
    },
  },
  preHandler: async (request, reply) => {
    const accessToken = request.headers["x-access-token"] as string;
    const jwt = new JWT(env.SECRET, TWELVE_HOURS_IN_SECONDS);
    const payloadOrError = jwt.verify(accessToken);

    if (payloadOrError instanceof Error) {
      reply.status(400);
      reply.send({ message: "Não autorizado" });
    }
  },
  handler: async (request) => {
    const { productId } = request.params as { productId: number };
    const { name, value } = request.body as { name: string; value: number };
    const productService = new ProductService(new ProductRepository(knex));
    await productService.update({ id: productId, name, value });
  },
});

fastify.listen({ port: 3333 });
