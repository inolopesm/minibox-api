import { FindProductController } from "./find-product-controller";
import type { Product } from "../../entities/product";
import type { Request, Response } from "../../protocols/http";
import type { FindProductRepository } from "../../repositories/product-repository";

class FindProductRepositorySpy implements FindProductRepository {
  result: Product[] = [
    {
      id: Number(Math.random().toString().substring(2)),
      name: Math.random().toString(36).substring(2),
      value: Number(Math.random().toString().substring(2)),
    },
    {
      id: Number(Math.random().toString().substring(2)),
      name: Math.random().toString(36).substring(2),
      value: Number(Math.random().toString().substring(2)),
    },
  ];

  async find(): Promise<Product[]> {
    return this.result;
  }
}

describe("FindProductController", () => {
  let request: Request;
  let findProductRepositorySpy: FindProductRepositorySpy;
  let findProductController: FindProductController;

  beforeEach(() => {
    request = { headers: {}, path: {}, query: {}, body: {} };
    findProductRepositorySpy = new FindProductRepositorySpy();
    findProductController = new FindProductController(findProductRepositorySpy);
  });

  it("should return all products", async () => {
    const response = await findProductController.handle(request);

    const expectedResponse: Response = {
      statusCode: 200,
      body: findProductRepositorySpy.result,
    };

    expect(response).toEqual(expectedResponse);
  });
});
