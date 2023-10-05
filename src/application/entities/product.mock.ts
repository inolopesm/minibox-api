import { faker } from "@faker-js/faker";
import { Product } from "./product";

export function makeProduct(): Product {
  return {
    id: faker.number.int({ min: 1, max: 2147483647 }),
    name: faker.commerce.productName().substring(0, 48),
    value: faker.number.int({ min: 1, max: 99999 }),
  };
}
