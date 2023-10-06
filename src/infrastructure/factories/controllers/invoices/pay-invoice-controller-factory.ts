import {
  PayInvoiceController,
  PayInvoiceRequest,
} from "../../../../application/controllers";

import { Controller } from "../../../../application/protocols";
import { AjvValidationAdapter } from "../../../adapters";
import { InvoiceKnexRepository } from "../../../repositories";

import {
  makeAccessTokenDecorator,
  makeLogErrorDecorator,
} from "../../decorators";

export function makePayInvoiceController(): Controller {
  return makeLogErrorDecorator(
    makeAccessTokenDecorator(
      new PayInvoiceController(
        new AjvValidationAdapter<PayInvoiceRequest>({
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
        new InvoiceKnexRepository(), // UpdatePaidAtByIdInvoiceRepository
      ),
    ),
  );
}
