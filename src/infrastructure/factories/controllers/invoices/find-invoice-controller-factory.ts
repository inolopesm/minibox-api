import {
  FindInvoiceController,
  FindInvoiceRequest,
} from "../../../../application/controllers";
import { Controller } from "../../../../application/protocols";
import { AjvValidationAdapter } from "../../../adapters";
import { InvoiceKnexRepository } from "../../../repositories";
import { makeAccessTokenDecorator } from "../../decorators";

export function makeFindInvoiceController(): Controller {
  return makeAccessTokenDecorator(
    new FindInvoiceController(
      new AjvValidationAdapter<FindInvoiceRequest>({
        type: "object",
        required: ["query"],
        properties: {
          query: {
            type: "object",
            properties: {
              teamId: { type: "string", pattern: "[0-9]+", nullable: true },
              personId: { type: "string", pattern: "[0-9]+", nullable: true },
              paid: { type: "string", pattern: "true|false", nullable: true },
            },
          },
        },
      }),
      new InvoiceKnexRepository(), // FindByTeamIdAndPersonIdAndPaidAtInvoiceRepository
      new InvoiceKnexRepository(), // FindByTeamIdAndPersonIdInvoiceRepository
      new InvoiceKnexRepository(), // FindByTeamIdAndPaidAtInvoiceRepository
      new InvoiceKnexRepository(), // FindByTeamIdInvoiceRepository
      new InvoiceKnexRepository(), // FindByPersonIdAndPaidAtInvoiceRepository
      new InvoiceKnexRepository(), // FindByPersonIdInvoiceRepository
      new InvoiceKnexRepository(), // FindByPaidAtInvoiceRepository
      new InvoiceKnexRepository(), // FindInvoiceRepository
    ),
  );
}
