import { Controller, Request, Response, Validation } from "../../protocols";
import { UpdateNameAndValueByIdProductRepository } from "../../repositories";

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
