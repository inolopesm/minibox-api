import {
  FindOneInvoiceController,
  FindOneInvoiceRequest,
} from "../../../../application/controllers";

import { Controller } from "../../../../application/protocols";
import { AjvValidationAdapter } from "../../../adapters";
import { InvoiceKnexRepository } from "../../../repositories";

import {
  makeAccessTokenDecorator,
  makeLogErrorDecorator,
} from "../../decorators";

export function makeFindOneInvoiceController(): Controller {
  return makeLogErrorDecorator(
    makeAccessTokenDecorator(
      new FindOneInvoiceController(
        new AjvValidationAdapter<FindOneInvoiceRequest>({
          type: "object",
          required: ["params"],
          properties: {
            params: {
              type: "object",
              required: ["invoiceId"],
              properties: {
                invoiceId: { type: "string", pattern: "[0-9]+" },
              },
            },
          },
        }),
        new InvoiceKnexRepository(), // FindOneByIdInvoiceRepository
      ),
    ),
  );
}
