import type {
  Controller,
  Request,
  Response,
  Validation,
} from "../../protocols";

import type {
  FindLikeNameProductRepository,
  FindProductRepository,
} from "../../repositories";

export interface FindProductRequest {
  query: { name?: string };
}

export class FindProductController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly findProductRepository: FindProductRepository,
    private readonly findLikeNameProductRepository: FindLikeNameProductRepository,
  ) {}

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return { statusCode: 400, body: { message: error.message } };
    }

    const { name } = request.query as FindProductRequest["query"];

    const products =
      name !== undefined
        ? await this.findLikeNameProductRepository.findLikeName(name)
        : await this.findProductRepository.find();

    return { statusCode: 200, body: products };
  }
}
