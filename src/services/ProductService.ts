import type { Product } from "../entities/Product";
import type { ProductRepository } from "../repositories/ProductRepository";

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async find(name: string | undefined = ""): Promise<Product[]> {
    return await this.productRepository.findILikeName(name);
  }

  async findOne(id: number): Promise<Product | Error> {
    const product = await this.productRepository.findOneById(id);

    if (product === null) {
      return new Error("Produto não encontrado");
    }

    return product;
  }

  async create(name: string, value: number): Promise<void> {
    await this.productRepository.create(name, value);
  }

  async update({
    name,
    value,
    id,
  }: {
    name: string;
    value: number;
    id: number;
  }): Promise<void> {
    await this.productRepository.updateNameAndValueById({ name, value, id });
  }
}
