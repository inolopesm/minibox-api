import type { ProductService } from "../services/ProductService";
import type { FastifyReply, FastifyRequest } from "fastify";

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  async index(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { name } = request.query as { name?: string };
    const products = await this.productService.find(name);
    await reply.status(200).send(products);
  }

  async show(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { productId } = request.params as { productId: number };
    const productOrError = await this.productService.findOne(productId);

    if (productOrError instanceof Error) {
      const error = productOrError;
      await reply.status(400).send({ message: error.message });
      return;
    }

    const product = productOrError;

    await reply.status(200).send(product);
  }

  async store(request: FastifyRequest): Promise<void> {
    const { name, value } = request.body as { name: string; value: number };
    await this.productService.create(name, value);
  }

  async update(request: FastifyRequest): Promise<void> {
    const { productId } = request.params as { productId: number };
    const { name, value } = request.body as { name: string; value: number };
    await this.productService.update({ id: productId, name, value });
  }
}
