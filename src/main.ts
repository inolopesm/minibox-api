/* eslint-disable @typescript-eslint/no-floating-promises, @typescript-eslint/no-misused-promises */
import FastifyCors from "@fastify/cors";
import AJV from "ajv";
import Fastify from "fastify";
import Knex from "knex";

import { InvoiceController } from "./controllers/InvoiceController";
import { PersonController } from "./controllers/PersonController";
import { ProductController } from "./controllers/ProductController";
import { SessionController } from "./controllers/SessionController";
import { TeamController } from "./controllers/TeamController";
import { UserController } from "./controllers/UserController";

import { AccessTokenMiddleware } from "./middlewares/AccessTokenMiddleware";
import { ApiKeyMiddleware } from "./middlewares/ApiKeyMiddleware";

import { InvoiceRepository } from "./repositories/InvoiceRepository";
import { PersonRepository } from "./repositories/PersonRepository";
import { ProductRepository } from "./repositories/ProductRepository";
import { TeamRepository } from "./repositories/TeamRepository";
import { UserRepository } from "./repositories/UserRepository";

import { InvoiceService } from "./services/InvoiceService";
import { PersonService } from "./services/PersonService";
import { ProductService } from "./services/ProductService";
import { SessionService } from "./services/SessionService";
import { TeamService } from "./services/TeamService";
import { UserService } from "./services/UserService";

import { JWT } from "./utils/JWT";

import { AccessTokenValidation } from "./validations/AccessTokenValidation";
import { ApiKeyValidation } from "./validations/ApiKeyValidation";
import { InvoiceValidation } from "./validations/InvoiceValidation";
import { PersonValidation } from "./validations/PersonValidation";
import { ProductValidation } from "./validations/ProductValidation";
import { SessionValidation } from "./validations/SessionValidation";
import { TeamValidation } from "./validations/TeamValidation";
import { UserValidation } from "./validations/UserValidation";

//

const TWELVE_HOURS_IN_SECONDS = 12 * 60 * 60;

//

const env = {
  SECRET: process.env.SECRET as string,
  POSTGRES_URL: process.env.POSTGRES_URL as string,
  API_KEY: process.env.API_KEY as string,
  PORT: process.env.PORT !== undefined ? Number(process.env.PORT) : 3333,
};

{
  const schema = {
    type: "object",
    required: ["SECRET", "POSTGRES_URL", "API_KEY"],
    properties: {
      SECRET: { type: "string" },
      POSTGRES_URL: { type: "string" },
      API_KEY: { type: "string" },
      PORT: { type: "integer", minimum: 0, maximum: 65535 },
    },
  };

  if (!new AJV().compile(schema)(env)) {
    throw new Error("Validation failed on environment variables");
  }
}

//

const knex = Knex({ client: "pg", connection: env.POSTGRES_URL });

const jwt = new JWT(env.SECRET, TWELVE_HOURS_IN_SECONDS);

const invoiceRepository = new InvoiceRepository(knex);
const personRepository = new PersonRepository(knex);
const productRepository = new ProductRepository(knex);
const teamRepository = new TeamRepository(knex);
const userRepository = new UserRepository(knex);

const invoiceService = new InvoiceService(invoiceRepository, personRepository);
const personService = new PersonService(personRepository, teamRepository);
const productService = new ProductService(productRepository);
const sessionService = new SessionService(userRepository, jwt);
const teamService = new TeamService(teamRepository);
const userService = new UserService(userRepository);

const apiKeyMiddleware = new ApiKeyMiddleware(env.API_KEY);
const accessTokenMiddleware = new AccessTokenMiddleware(jwt);

const invoiceController = new InvoiceController(invoiceService);
const personController = new PersonController(personService);
const productController = new ProductController(productService);
const sessionController = new SessionController(sessionService);
const teamController = new TeamController(teamService);
const userController = new UserController(userService);

//

const fastify = Fastify();

fastify.register(FastifyCors);

//

fastify.route({
  method: "POST",
  url: "/sessions",
  schema: { body: SessionValidation.store },
  handler: sessionController.store.bind(sessionController),
});

fastify.route({
  method: "POST",
  url: "/users",
  schema: { headers: ApiKeyValidation.use, body: UserValidation.store },
  preHandler: apiKeyMiddleware.use.bind(apiKeyMiddleware),
  handler: userController.store.bind(userController),
});

fastify.route({
  method: "GET",
  url: "/products",
  schema: {
    headers: AccessTokenValidation.use,
    querystring: ProductValidation.index,
  },
  preHandler: accessTokenMiddleware.use.bind(accessTokenMiddleware),
  handler: productController.index.bind(productController),
});

fastify.route({
  method: "POST",
  url: "/products",
  schema: {
    headers: AccessTokenValidation.use,
    body: ProductValidation.store,
  },
  preHandler: accessTokenMiddleware.use.bind(accessTokenMiddleware),
  handler: productController.store.bind(productController),
});

fastify.route({
  method: "GET",
  url: "/products/:productId",
  schema: {
    headers: AccessTokenValidation.use,
    params: ProductValidation.show,
  },
  preHandler: accessTokenMiddleware.use.bind(accessTokenMiddleware),
  handler: productController.show.bind(productController),
});

fastify.route({
  method: "PUT",
  url: "/products/:productId",
  schema: {
    headers: AccessTokenValidation.use,
    params: ProductValidation.show,
    body: ProductValidation.store,
  },
  preHandler: accessTokenMiddleware.use.bind(accessTokenMiddleware),
  handler: productController.update.bind(productController),
});

fastify.route({
  method: "GET",
  url: "/teams",
  schema: {
    headers: AccessTokenValidation.use,
    querystring: TeamValidation.index,
  },
  preHandler: accessTokenMiddleware.use.bind(accessTokenMiddleware),
  handler: teamController.index.bind(teamController),
});

fastify.route({
  method: "POST",
  url: "/teams",
  schema: {
    headers: AccessTokenValidation.use,
    body: TeamValidation.store,
  },
  preHandler: accessTokenMiddleware.use.bind(accessTokenMiddleware),
  handler: teamController.store.bind(teamController),
});

fastify.route({
  method: "GET",
  url: "/teams/:teamId",
  schema: {
    headers: AccessTokenValidation.use,
    params: TeamValidation.show,
  },
  preHandler: accessTokenMiddleware.use.bind(accessTokenMiddleware),
  handler: teamController.show.bind(teamController),
});

fastify.route({
  method: "PUT",
  url: "/teams/:teamId",
  schema: {
    headers: AccessTokenValidation.use,
    params: TeamValidation.show,
    body: TeamValidation.store,
  },
  preHandler: accessTokenMiddleware.use.bind(accessTokenMiddleware),
  handler: teamController.update.bind(teamController),
});

fastify.route({
  method: "GET",
  url: "/people",
  schema: {
    headers: AccessTokenValidation.use,
    querystring: PersonValidation.index,
  },
  preHandler: accessTokenMiddleware.use.bind(accessTokenMiddleware),
  handler: personController.index.bind(personController),
});

fastify.route({
  method: "POST",
  url: "/people",
  schema: {
    headers: AccessTokenValidation.use,
    body: PersonValidation.store,
  },
  preHandler: accessTokenMiddleware.use.bind(accessTokenMiddleware),
  handler: personController.store.bind(personController),
});

fastify.route({
  method: "GET",
  url: "/people/:personId",
  schema: {
    headers: AccessTokenValidation.use,
    params: PersonValidation.show,
  },
  preHandler: accessTokenMiddleware.use.bind(accessTokenMiddleware),
  handler: personController.show.bind(personController),
});

fastify.route({
  method: "PUT",
  url: "/people/:personId",
  schema: {
    headers: AccessTokenValidation.use,
    params: PersonValidation.show,
    body: PersonValidation.store,
  },
  preHandler: accessTokenMiddleware.use.bind(accessTokenMiddleware),
  handler: personController.update.bind(personController),
});

fastify.route({
  method: "GET",
  url: "/invoices",
  schema: {
    headers: AccessTokenValidation.use,
    querystring: InvoiceValidation.index,
  },
  preHandler: accessTokenMiddleware.use.bind(accessTokenMiddleware),
  handler: invoiceController.index.bind(invoiceController),
});

fastify.route({
  method: "GET",
  url: "/invoices/:invoiceId",
  schema: {
    headers: AccessTokenValidation.use,
    params: InvoiceValidation.show,
  },
  preHandler: accessTokenMiddleware.use.bind(accessTokenMiddleware),
  handler: invoiceController.show.bind(invoiceController),
});

fastify.route({
  method: "POST",
  url: "/invoices",
  schema: {
    headers: AccessTokenValidation.use,
    body: InvoiceValidation.store,
  },
  preHandler: accessTokenMiddleware.use.bind(accessTokenMiddleware),
  handler: invoiceController.store.bind(invoiceController),
});

fastify.route({
  method: "PUT",
  url: "/invoices/:invoiceId/pay",
  schema: {
    headers: AccessTokenValidation.use,
    params: InvoiceValidation.show,
  },
  preHandler: accessTokenMiddleware.use.bind(accessTokenMiddleware),
  handler: invoiceController.pay.bind(invoiceController),
});
//

fastify.listen({ port: env.PORT, host: "0.0.0.0" });
