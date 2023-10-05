import { Product } from "../../entities";
import { makeProduct } from "../../entities/product.mock";
import { Request, Response } from "../../protocols";
import { CreateProductRepositorySpy } from "../../repositories/product-repository.mock";
import { ValidationSpy } from "../../validations/validation.mock";

import {
  CreateProductController,
  CreateProductRequest,
} from "./create-product-controller";

describe("CreateProductController", () => {
  let product: Product;
  let request: Request & CreateProductRequest;
  let validationSpy: ValidationSpy;
  let createProductRepositorySpy: CreateProductRepositorySpy;
  let createProductController: CreateProductController;

  beforeEach(() => {
    product = makeProduct();

    request = {
      headers: {},
      params: {},
      query: {},
      body: { name: product.name, value: product.value },
    };

    validationSpy = new ValidationSpy();
    createProductRepositorySpy = new CreateProductRepositorySpy();

    createProductController = new CreateProductController(
      validationSpy,
      createProductRepositorySpy,
    );
  });

  it("should fail when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await createProductController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should create product successfully", async () => {
    const response = await createProductController.handle(request);
    const expectedResponse: Response = { statusCode: 200 };
    expect(response).toEqual(expectedResponse);
    expect(createProductRepositorySpy.name).toBe(product.name);
    expect(createProductRepositorySpy.value).toBe(product.value);
  });
});
