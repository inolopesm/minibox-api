import { Controller, Request, Response, Validation } from "../../protocols";
import { FindLikeNameProductRepository } from "../../repositories";

export interface FindProductRequest {
  query: { name?: string };
}

export class FindProductController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly findLikeNameProductRepository: FindLikeNameProductRepository,
  ) {}

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return { statusCode: 400, body: { message: error.message } };
    }

    const { name = "" } = request.query as FindProductRequest["query"];

    const products =
      await this.findLikeNameProductRepository.findLikeName(name);

    return { statusCode: 200, body: products };
  }
}
