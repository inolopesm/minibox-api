import {
  PayInvoiceController,
  PayInvoiceRequest,
} from "../../../../application/controllers";

import { Controller } from "../../../../application/protocols";
import { AjvValidationAdapter } from "../../../adapters";
import { InvoiceKnexRepository } from "../../../repositories";
import { makeAccessTokenDecorator } from "../../decorators";

export function makePayInvoiceController(): Controller {
  return makeAccessTokenDecorator(
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
  );
}
