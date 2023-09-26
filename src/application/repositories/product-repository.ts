import type { Product } from "../entities/product";

export interface FindProductRepository {
  find: () => Promise<Product[]>;
}
