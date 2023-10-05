import { Product } from "../../entities";
import { makeProduct } from "../../entities/product.mock";
import { Request, Response } from "../../protocols";
import { FindLikeNameProductRepositorySpy } from "../../repositories/product-repository.mock";
import { ValidationSpy } from "../../validations/validation.mock";

import {
  FindProductController,
  FindProductRequest,
} from "./find-product-controller";

describe("FindProductController", () => {
  let product: Product;
  let request: Request & FindProductRequest;
  let validationSpy: ValidationSpy;
  let findLikeNameProductRepositorySpy: FindLikeNameProductRepositorySpy;
  let findProductController: FindProductController;

  beforeEach(() => {
    product = makeProduct();
    request = { headers: {}, params: {}, query: {}, body: {} };

    validationSpy = new ValidationSpy();
    findLikeNameProductRepositorySpy = new FindLikeNameProductRepositorySpy();

    findProductController = new FindProductController(
      validationSpy,
      findLikeNameProductRepositorySpy,
    );
  });

  it("should fail when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await findProductController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should find products by name successfully", async () => {
    {
      const response = await findProductController.handle(request);

      const expectedResponse: Response = {
        statusCode: 200,
        body: findLikeNameProductRepositorySpy.result,
      };

      expect(response).toEqual(expectedResponse);
      expect(findLikeNameProductRepositorySpy.name).toBe("");
    }

    {
      request.query.name = product.name;
      const response = await findProductController.handle(request);

      const expectedResponse: Response = {
        statusCode: 200,
        body: findLikeNameProductRepositorySpy.result,
      };

      expect(response).toEqual(expectedResponse);
      expect(findLikeNameProductRepositorySpy.name).toBe(request.query.name);
    }
  });
});
