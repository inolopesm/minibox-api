import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { adapt } from "./infrastructure/adapters";
import { POSTGRES_URL } from "./infrastructure/configs";

import {
  makeCreateInvoiceController,
  makeCreatePersonController,
  makeCreateProductController,
  makeCreateSessionController,
  makeCreateTeamController,
  makeCreateUserController,
  makeFindInvoiceController,
  makeFindOneInvoiceController,
  makeFindOnePersonController,
  makeFindOneProductController,
  makeFindOneTeamController,
  makeFindPersonController,
  makeFindProductController,
  makeFindTeamController,
  makePayInvoiceController,
  makeUpdatePersonController,
  makeUpdateProductController,
  makeUpdateTeamController,
} from "./infrastructure/factories";

import { KnexHelper } from "./infrastructure/helpers";

KnexHelper.getInstance().connect(POSTGRES_URL);

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

export const createSession = adapt(makeCreateSessionController());
export const createUser = adapt(makeCreateUserController());

export const findProducts = adapt(makeFindProductController());
export const findOneProduct = adapt(makeFindOneProductController());
export const createProduct = adapt(makeCreateProductController());
export const updateProduct = adapt(makeUpdateProductController());

export const findTeams = adapt(makeFindTeamController());
export const findOneTeam = adapt(makeFindOneTeamController());
export const createTeam = adapt(makeCreateTeamController());
export const updateTeam = adapt(makeUpdateTeamController());

export const findPeople = adapt(makeFindPersonController());
export const findOnePerson = adapt(makeFindOnePersonController());
export const createPerson = adapt(makeCreatePersonController());
export const updatePerson = adapt(makeUpdatePersonController());

export const findInvoices = adapt(makeFindInvoiceController());
export const findOneInvoice = adapt(makeFindOneInvoiceController());
export const createInvoice = adapt(makeCreateInvoiceController());
export const payInvoice = adapt(makePayInvoiceController());
