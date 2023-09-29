import type { Product } from "../../application/entities/product";

import type {
  CreateProductRepository,
  FindLikeNameProductRepository,
  FindOneByIdProductRepository,
  UpdateNameAndValueByIdProductRepository,
} from "../../application/repositories/product-repository";

import type { Knex } from "knex";

export class ProductKnexRepository
  implements
    FindLikeNameProductRepository,
    FindOneByIdProductRepository,
    CreateProductRepository,
    UpdateNameAndValueByIdProductRepository
{
  constructor(private readonly knex: Knex) {}

  async findLikeName(name: string): Promise<Product[]> {
    return await this.knex<Product>("Product")
      .whereILike("name", `%${name}%`)
      .orderBy("id");
  }

  async findOneById(id: number): Promise<Product | null> {
    const row = await this.knex<Product>("Product").where({ id }).first();
    if (row === undefined) return null;
    return row;
  }

  async create(name: string, value: number): Promise<void> {
    await this.knex<Product>("Product").insert({ name, value });
  }

  async updateNameAndValueById({
    name,
    value,
    id,
  }: {
    name: string;
    value: number;
    id: number;
  }): Promise<void> {
    await this.knex<Product>("Product").update({ name, value }).where({ id });
  }
}
