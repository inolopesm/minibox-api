import { Product } from "../entities/product";

export interface FindLikeNameProductRepository {
  findLikeName(name: string): Promise<Product[]>;
}

export interface CreateProductRepository {
  create(name: string, value: number): Promise<void>;
}

export interface FindOneByIdProductRepository {
  findOneById(id: number): Promise<Product | null>;
}

export interface UpdateNameAndValueByIdProductRepository {
  updateNameAndValueById({
    name,
    value,
    id,
  }: {
    name: string;
    value: number;
    id: number;
  }): Promise<void>;
}
