import type { Product } from "../application/entities/product";
import type { FindProductRepository } from "../application/repositories/product-repository";
import type { Knex } from "knex";

export class ProductKnexRepository implements FindProductRepository {
  constructor(private readonly knex: Knex) {}

  async find(): Promise<Product[]> {
    return await this.knex<Product>("Product").orderBy("id");
  }
}
