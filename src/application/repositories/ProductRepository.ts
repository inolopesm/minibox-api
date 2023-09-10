import type { Knex } from "knex";
import type { Product } from "../entities/Product";

export class ProductRepository {
  constructor(private readonly knex: Knex) {}

  async findILikeName(name: string): Promise<Product[]> {
    return await this.knex<Product>("Product")
      .whereILike("name", `%${name}%`)
      .orderBy("id");
  }

  async findOneById(id: number): Promise<Product | null> {
    const row = await this.knex<Product>("Product").where({ id }).first();
    return row ?? null;
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
    await this.knex<Product>("Product").where({ id }).update({ name, value });
  }
}
