import { Product } from "../../entities";
import { makeProduct } from "../../entities/product.mock";
import { Request, Response } from "../../protocols";
import { FindOneByIdProductRepositorySpy } from "../../repositories/product-repository.mock";
import { ValidationSpy } from "../../validations/validation.mock";

import {
  FindOneProductController,
  FindOneProductRequest,
} from "./find-one-product-controller";

describe("FindOneProductController", () => {
  let product: Product;
  let request: Request & FindOneProductRequest;
  let validationSpy: ValidationSpy;
  let findOneByIdProductRepositorySpy: FindOneByIdProductRepositorySpy;
  let findOneProductController: FindOneProductController;

  beforeEach(() => {
    product = makeProduct();

    request = {
      headers: {},
      params: { productId: product.id.toString() },
      query: {},
      body: {},
    };

    validationSpy = new ValidationSpy();
    findOneByIdProductRepositorySpy = new FindOneByIdProductRepositorySpy();

    findOneProductController = new FindOneProductController(
      validationSpy,
      findOneByIdProductRepositorySpy,
    );
  });

  it("should fail when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await findOneProductController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should fail when product is not found", async () => {
    findOneByIdProductRepositorySpy.result = null;

    const response = await findOneProductController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: "Produto não encontrado" },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should find product successfully", async () => {
    const response = await findOneProductController.handle(request);

    const expectedResponse: Response = {
      statusCode: 200,
      body: findOneByIdProductRepositorySpy.result,
    };

    expect(findOneByIdProductRepositorySpy.id).toBe(product.id);
    expect(response).toEqual(expectedResponse);
  });
});
