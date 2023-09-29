import type { Controller, Request, Response } from "../../protocols/http";
import type { Validation } from "../../protocols/validation";
import type { FindOneByIdProductRepository } from "../../repositories/product-repository";

export interface FindOneProductRequest {
  params: { productId: string };
}

export class FindOneProductController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly findOneByIdProductRepository: FindOneByIdProductRepository,
  ) {}

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return { statusCode: 400, body: { message: error.message } };
    }

    const { productId } = request.params as FindOneProductRequest["params"];
    const id = Number(productId);

    const product = await this.findOneByIdProductRepository.findOneById(id);

    if (product === null) {
      return { statusCode: 400, body: { message: "Produto não encontrado" } };
    }

    return { statusCode: 200, body: product };
  }
}
