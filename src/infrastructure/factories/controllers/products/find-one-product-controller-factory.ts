import {
  FindOneProductController,
  FindOneProductRequest,
} from "../../../../application/controllers";

import { Controller } from "../../../../application/protocols";
import { AjvValidationAdapter } from "../../../adapters";
import { ProductKnexRepository } from "../../../repositories";

import {
  makeAccessTokenDecorator,
  makeLogErrorDecorator,
} from "../../decorators";

export function makeFindOneProductController(): Controller {
  return makeLogErrorDecorator(
    makeAccessTokenDecorator(
      new FindOneProductController(
        new AjvValidationAdapter<FindOneProductRequest>({
          type: "object",
          required: ["params"],
          properties: {
            params: {
              type: "object",
              required: ["productId"],
              properties: {
                productId: { type: "string", pattern: "[0-9]+" },
              },
            },
          },
        }),
        new ProductKnexRepository(), // FindOneByIdProductRepository
      ),
    ),
  );
}
