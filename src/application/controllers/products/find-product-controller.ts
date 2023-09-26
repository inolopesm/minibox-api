import type { Controller, Request, Response } from "../../protocols/http";
import type { FindProductRepository } from "../../repositories/product-repository";

export class FindProductController implements Controller {
  constructor(private readonly findProductRepository: FindProductRepository) {}

  async handle(_: Request): Promise<Response> {
    const products = await this.findProductRepository.find();
    return { statusCode: 200, body: products };
  }
}
