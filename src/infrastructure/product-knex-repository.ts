import type { Product } from "../application/entities/product";

import type {
  FindLikeNameProductRepository,
  FindProductRepository,
} from "../application/repositories/product-repository";

import type { Knex } from "knex";

export class ProductKnexRepository
  implements FindProductRepository, FindLikeNameProductRepository
{
  constructor(private readonly knex: Knex) {}

  async find(): Promise<Product[]> {
    return await this.knex<Product>("Product").orderBy("id");
  }

  async findLikeName(name: string): Promise<Product[]> {
    return await this.knex<Product>("Product")
      .whereILike("name", `%${name}%`)
      .orderBy("id");
  }
}
