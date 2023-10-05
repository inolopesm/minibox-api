import { Controller, Request, Response, Validation } from "../../protocols";
import { FindOneByIdInvoiceRepository } from "../../repositories";

export interface FindOneInvoiceRequest {
  params: { invoiceId: string };
}

export class FindOneInvoiceController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly findOneByIdInvoiceRepository: FindOneByIdInvoiceRepository,
  ) {}

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return { statusCode: 400, body: { message: error.message } };
    }

    const { invoiceId } = request.params as FindOneInvoiceRequest["params"];
    const id = Number(invoiceId);

    const invoice = await this.findOneByIdInvoiceRepository.findOneById(id);

    if (invoice === null) {
      return { statusCode: 400, body: { message: "Fatura não encontrada" } };
    }

    return { statusCode: 200, body: invoice };
  }
}
