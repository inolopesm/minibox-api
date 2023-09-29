import type {
  Controller,
  Request,
  Response,
  Validation,
} from "../../protocols";

import type { CreateProductRepository } from "../../repositories";

export interface CreateProductRequest {
  body: { name: string; value: number };
}

export class CreateProductController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly createProductRepository: CreateProductRepository,
  ) {}

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return { statusCode: 400, body: { message: error.message } };
    }

    const { name, value } = request.body as CreateProductRequest["body"];

    await this.createProductRepository.create(name, value);

    return { statusCode: 200 };
  }
}
