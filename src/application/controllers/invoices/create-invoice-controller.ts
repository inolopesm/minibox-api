import { Controller, Request, Response, Validation } from "../../protocols";

import {
  CreateInvoiceRepository,
  FindOneByIdPersonRepository,
} from "../../repositories";

export interface CreateInvoiceRequest {
  body: { personId: number; products: Array<{ name: string; value: number }> };
}

export class CreateInvoiceController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly findOneByIdPersonRepository: FindOneByIdPersonRepository,
    private readonly createInvoiceRepository: CreateInvoiceRepository,
  ) {}

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return { statusCode: 400, body: { message: error.message } };
    }

    const { personId, products } = request.body as CreateInvoiceRequest["body"];

    const person = await this.findOneByIdPersonRepository.findOneById(personId);

    if (person === null) {
      return { statusCode: 400, body: { message: "Pessoa não encontrada" } };
    }

    await this.createInvoiceRepository.create({
      personId,
      createdAt: Date.now(),
      products: products.map(({ name, value }) => ({ name, value })),
    });

    return { statusCode: 200 };
  }
}
