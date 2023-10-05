import {
  UpdateProductController,
  UpdateProductRequest,
} from "../../../../application/controllers";

import { Controller } from "../../../../application/protocols";
import { AjvValidationAdapter } from "../../../adapters";
import { ProductKnexRepository } from "../../../repositories";
import { makeAccessTokenDecorator } from "../../decorators";

export function makeUpdateProductController(): Controller {
  return makeAccessTokenDecorator(
    new UpdateProductController(
      new AjvValidationAdapter<UpdateProductRequest>({
        type: "object",
        required: ["params", "body"],
        properties: {
          params: {
            type: "object",
            required: ["productId"],
            properties: {
              productId: { type: "string", pattern: "[0-9]+" },
            },
          },
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
      new ProductKnexRepository(), // UpdateNameAndValueByIdProductRepository
    ),
  );
}
