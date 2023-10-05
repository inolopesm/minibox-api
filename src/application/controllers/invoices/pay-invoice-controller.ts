import { Controller, Request, Response, Validation } from "../../protocols";

import {
  FindOneByIdInvoiceRepository,
  UpdatePaidAtByIdInvoiceRepository,
} from "../../repositories";

export interface PayInvoiceRequest {
  params: { invoiceId: string };
}

export class PayInvoiceController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly findOneByIdInvoiceRepository: FindOneByIdInvoiceRepository,
    private readonly updatePaidAtByIdInvoiceRepository: UpdatePaidAtByIdInvoiceRepository,
  ) {}

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return { statusCode: 400, body: { message: error.message } };
    }

    const { invoiceId } = request.params as PayInvoiceRequest["params"];
    const id = Number(invoiceId);

    const invoice = await this.findOneByIdInvoiceRepository.findOneById(id);

    if (invoice === null) {
      return { statusCode: 400, body: { message: "Fatura não encontrada" } };
    }

    await this.updatePaidAtByIdInvoiceRepository.updatePaidAtById(
      Date.now(),
      id,
    );

    return { statusCode: 200 };
  }
}
