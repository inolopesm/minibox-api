import { Product } from "../entities";
import { makeProduct } from "../entities/product.mock";

import {
  CreateProductRepository,
  FindLikeNameProductRepository,
  FindOneByIdProductRepository,
  UpdateNameAndValueByIdProductRepository,
} from "./product-repository";

export class CreateProductRepositorySpy implements CreateProductRepository {
  name?: string;
  value?: number;

  async create(name: string, value: number): Promise<void> {
    this.name = name;
    this.value = value;
  }
}

export class FindLikeNameProductRepositorySpy
  implements FindLikeNameProductRepository
{
  name?: string;
  result: Product[] = [makeProduct(), makeProduct(), makeProduct()];

  async findLikeName(name: string): Promise<Product[]> {
    this.name = name;
    return this.result;
  }
}

export class FindOneByIdProductRepositorySpy
  implements FindOneByIdProductRepository
{
  id?: number;
  result: Product | null = makeProduct();

  async findOneById(id: number): Promise<Product | null> {
    this.id = id;
    return this.result;
  }
}

export class UpdateNameAndValueByIdProductRepositorySpy
  implements UpdateNameAndValueByIdProductRepository
{
  params?: {
    name: string;
    value: number;
    id: number;
  };

  async updateNameAndValueById(params: {
    name: string;
    value: number;
    id: number;
  }): Promise<void> {
    this.params = params;
  }
}
