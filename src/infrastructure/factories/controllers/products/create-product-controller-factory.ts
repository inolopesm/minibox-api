import {
  CreateProductController,
  CreateProductRequest,
} from "../../../../application/controllers";

import { Controller } from "../../../../application/protocols";
import { AjvValidationAdapter } from "../../../adapters";
import { ProductKnexRepository } from "../../../repositories";

import {
  makeAccessTokenDecorator,
  makeLogErrorDecorator,
} from "../../decorators";

export function makeCreateProductController(): Controller {
  return makeLogErrorDecorator(
    makeAccessTokenDecorator(
      new CreateProductController(
        new AjvValidationAdapter<CreateProductRequest>({
          type: "object",
          required: ["body"],
          properties: {
            body: {
              type: "object",
              required: ["name", "value"],
              properties: {
                name: { type: "string", minLength: 1, maxLength: 48 },
                value: { type: "integer", minimum: 1, maximum: 99999 },
              },
            },
          },
        }),
        new ProductKnexRepository(), // CreateProductRepository
      ),
    ),
  );
}
