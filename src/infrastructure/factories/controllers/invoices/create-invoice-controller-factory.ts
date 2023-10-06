import {
  CreateInvoiceController,
  CreateInvoiceRequest,
} from "../../../../application/controllers";

import { Controller } from "../../../../application/protocols";
import { AjvValidationAdapter } from "../../../adapters";

import {
  InvoiceKnexRepository,
  PersonKnexRepository,
} from "../../../repositories";

import {
  makeAccessTokenDecorator,
  makeLogErrorDecorator,
} from "../../decorators";

export function makeCreateInvoiceController(): Controller {
  return makeLogErrorDecorator(
    makeAccessTokenDecorator(
      new CreateInvoiceController(
        new AjvValidationAdapter<CreateInvoiceRequest>({
          type: "object",
          required: ["body"],
          properties: {
            body: {
              type: "object",
              required: ["personId", "products"],
              properties: {
                personId: { type: "integer", minimum: 1 },
                products: {
                  type: "array",
                  minItems: 1,
                  items: {
                    type: "object",
                    required: ["name", "value"],
                    properties: {
                      name: { type: "string", minLength: 1, maxLength: 48 },
                      value: { type: "integer", minimum: 1, maximum: 99999 },
                    },
                  },
                },
              },
            },
          },
        }),
        new PersonKnexRepository(), // FindOneByIdPersonRepository
        new InvoiceKnexRepository(), // CreateInvoiceRepository
      ),
    ),
  );
}
