import { Product } from "../../entities";
import { makeProduct } from "../../entities/product.mock";
import { Request, Response } from "../../protocols";
import { UpdateNameAndValueByIdProductRepositorySpy } from "../../repositories/product-repository.mock";
import { ValidationSpy } from "../../validations/validation.mock";

import {
  UpdateProductController,
  UpdateProductRequest,
} from "./update-product-controller";

describe("UpdateProductController", () => {
  let product: Product;
  let request: Request & UpdateProductRequest;
  let validationSpy: ValidationSpy;
  let updateNameAndValueByIdProductRepositorySpy: UpdateNameAndValueByIdProductRepositorySpy;
  let updateProductController: UpdateProductController;

  beforeEach(() => {
    product = makeProduct();

    request = {
      headers: {},
      params: { productId: product.id.toString() },
      query: {},
      body: { name: product.name, value: product.value },
    };

    validationSpy = new ValidationSpy();

    updateNameAndValueByIdProductRepositorySpy =
      new UpdateNameAndValueByIdProductRepositorySpy();

    updateProductController = new UpdateProductController(
      validationSpy,
      updateNameAndValueByIdProductRepositorySpy,
    );
  });

  it("should fail when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await updateProductController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should update product successfully", async () => {
    const response = await updateProductController.handle(request);

    const expectedResponse: Response = { statusCode: 200 };

    const expectedParams: NonNullable<
      UpdateNameAndValueByIdProductRepositorySpy["params"]
    > = {
      id: +request.params.productId,
      name: request.body.name,
      value: request.body.value,
    };

    expect(response).toEqual(expectedResponse);

    expect(updateNameAndValueByIdProductRepositorySpy.params).toEqual(
      expectedParams,
    );
  });
});
