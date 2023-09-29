import { FindProductController } from "./find-product-controller";
import type { Product } from "../../entities";
import type { Request, Response, Validation } from "../../protocols";

import type { FindLikeNameProductRepository } from "../../repositories/product-repository";

class ValidationSpy implements Validation {
  input?: unknown;
  result: Error | null = null;

  validate(input: unknown): Error | null {
    this.input = input;
    return this.result;
  }
}

class FindLikeNameProductRepositorySpy
  implements FindLikeNameProductRepository
{
  name?: string;
  result: Product[];

  constructor(name: string) {
    this.result = [
      {
        id: Number(Math.random().toString().substring(2)),
        name: `${name} ${Math.random().toString(36).substring(2)}`,
        value: Number(Math.random().toString().substring(2)),
      },
      {
        id: Number(Math.random().toString().substring(2)),
        name: `${Math.random().toString(36).substring(2)} ${name}`,
        value: Number(Math.random().toString().substring(2)),
      },
    ];
  }

  async findLikeName(name: string): Promise<Product[]> {
    this.name = name;
    return this.result;
  }
}

describe("FindProductController", () => {
  let name: string;
  let request: Request;
  let validationSpy: ValidationSpy;
  let findLikeNameProductRepositorySpy: FindLikeNameProductRepositorySpy;
  let findProductController: FindProductController;

  beforeEach(() => {
    name = Math.random().toString(36).substring(2);
    request = { headers: {}, params: {}, query: {}, body: {} };

    validationSpy = new ValidationSpy();

    findLikeNameProductRepositorySpy = new FindLikeNameProductRepositorySpy(
      name,
    );

    findProductController = new FindProductController(
      validationSpy,
      findLikeNameProductRepositorySpy,
    );
  });

  it("should return all products", async () => {
    const response = await findProductController.handle(request);

    const expectedResponse: Response = {
      statusCode: 200,
      body: findLikeNameProductRepositorySpy.result,
    };

    expect(findLikeNameProductRepositorySpy.name).toEqual("");
    expect(response).toEqual(expectedResponse);
  });

  it("should return an array of products matching the provided name", async () => {
    request.query.name = name;
    const response = await findProductController.handle(request);

    const expectedResponse: Response = {
      statusCode: 200,
      body: findLikeNameProductRepositorySpy.result,
    };

    expect(findLikeNameProductRepositorySpy.name).toEqual(name);
    expect(response).toEqual(expectedResponse);
  });

  it("should return an error when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await findProductController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });
});
