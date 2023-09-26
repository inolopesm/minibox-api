import type { Product } from "../entities/product";

export interface FindProductRepository {
  find: () => Promise<Product[]>;
}

export interface FindLikeNameProductRepository {
  findLikeName: (name: string) => Promise<Product[]>;
}

export interface CreateProductRepository {
  create: (name: string, value: number) => Promise<void>;
}
