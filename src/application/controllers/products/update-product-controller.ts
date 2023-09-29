import type { Controller, Request, Response } from "../../protocols/http";
import type { Validation } from "../../protocols/validation";
import type { UpdateNameAndValueByIdProductRepository } from "../../repositories/product-repository";

export interface UpdateProductRequest {
  params: { productId: string };
  body: { name: string; value: number };
}

export class UpdateProductController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly updateNameAndValueByIdProductRepository: UpdateNameAndValueByIdProductRepository,
  ) {}

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return { statusCode: 400, body: { message: error.message } };
    }

    const { productId } = request.params as UpdateProductRequest["params"];
    const { name, value } = request.body as UpdateProductRequest["body"];
    const id = Number(productId);

    await this.updateNameAndValueByIdProductRepository.updateNameAndValueById({
      name,
      value,
      id,
    });

    return { statusCode: 200 };
  }
}
