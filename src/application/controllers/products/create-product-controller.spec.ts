import { CreateProductController } from "./create-product-controller";
import type { Request, Response } from "../../protocols/http";
import type { Validation } from "../../protocols/validation";
import type { CreateProductRepository } from "../../repositories/product-repository";

class ValidationSpy implements Validation {
  input?: unknown;
  result: Error | null = null;

  validate(input: unknown): Error | null {
    this.input = input;
    return this.result;
  }
}

class CreateProductRepositorySpy implements CreateProductRepository {
  name?: string;
  value?: number;

  async create(name: string, value: number): Promise<void> {
    this.name = name;
    this.value = value;
  }
}

describe("CreateProductController", () => {
  let name: string;
  let value: number;
  let request: Request;
  let validationSpy: ValidationSpy;
  let createProductRepositorySpy: CreateProductRepositorySpy;
  let createProductController: CreateProductController;

  beforeEach(() => {
    name = Math.random().toString(36).substring(2);
    value = Number(Math.random().toString().substring(2));
    request = { headers: {}, params: {}, query: {}, body: { name, value } };

    validationSpy = new ValidationSpy();
    createProductRepositorySpy = new CreateProductRepositorySpy();

    createProductController = new CreateProductController(
      validationSpy,
      createProductRepositorySpy,
    );
  });

  it("should create a new product", async () => {
    const response = await createProductController.handle(request);
    const expectedResponse: Response = { statusCode: 200 };
    expect(response).toEqual(expectedResponse);
    expect(createProductRepositorySpy.name).toBe(name);
    expect(createProductRepositorySpy.value).toBe(value);
  });

  it("should return an error when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await createProductController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });
});
