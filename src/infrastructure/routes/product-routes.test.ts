import { randomInt } from "node:crypto";
import { Knex } from "knex";
import { Product } from "../../application/entities";
import { makeProduct } from "../../application/entities/product.mock";
import { makeUser } from "../../application/entities/user.mock";
import { makeJwt } from "../factories";
import { KnexHelper } from "../helpers";
import { removeId } from "../utils";

describe("Product Routes", () => {
  let knex: Knex;
  let accessToken: string;

  beforeAll(() => {
    knex = KnexHelper.getInstance().getClient();
    const user = makeUser();
    accessToken = makeJwt().sign({ sub: user.id, username: user.username });
  });

  beforeEach(async () => {
    await knex<Product>("Product").truncate();
  });

  describe("GET /products", () => {
    it("should find products when success", async () => {
      const products: [Product, Product, Product] = [
        { ...makeProduct(), id: 1 },
        { ...makeProduct(), id: 2 },
        { ...makeProduct(), id: 3 },
      ];

      await knex<Product>("Product").insert(products.map(removeId));

      const response = await fetch(`${process.env.TEST_BASE_URL}/products`, {
        headers: { "x-access-token": accessToken },
      });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(products);
    });
  });

  describe("GET /products/:productId", () => {
    it("should find product when success", async () => {
      const products: [Product, Product, Product] = [
        { ...makeProduct(), id: 1 },
        { ...makeProduct(), id: 2 },
        { ...makeProduct(), id: 3 },
      ];

      await knex<Product>("Product").insert(products.map(removeId));

      const index = randomInt(products.length) as 0 | 1 | 2;

      const response = await fetch(
        `${process.env.TEST_BASE_URL}/products/${products[index].id}`,
        { headers: { "x-access-token": accessToken } },
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(products[index]);
    });
  });

  describe("POST /products", () => {
    it("should create product when success", async () => {
      const product = makeProduct();
      const { name, value } = product;

      const response = await fetch(`${process.env.TEST_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-access-token": accessToken,
        },
        body: JSON.stringify({ name, value }),
      });

      const rows = await knex<Product>("Product");
      const expectedRows: Product[] = [{ ...product, id: 1 }];

      expect(response.status).toBe(200);
      expect(rows).toEqual(expectedRows);
    });
  });

  describe("PUT /products/:productId", () => {
    it("should update product when success", async () => {
      const product = makeProduct();
      const anotherProduct = makeProduct();
      const { name, value } = anotherProduct;

      await knex<Product>("Product").insert(removeId(product));

      const response = await fetch(`${process.env.TEST_BASE_URL}/products/1`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          "x-access-token": accessToken,
        },
        body: JSON.stringify({ name, value }),
      });

      const rows = await knex<Product>("Product");
      const expectedRows: Product[] = [{ ...product, name, value, id: 1 }];

      expect(response.status).toBe(200);
      expect(rows).toEqual(expectedRows);
    });
  });
});
