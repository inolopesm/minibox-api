import {
  FindProductController,
  FindProductRequest,
} from "../../../../application/controllers";

import { Controller } from "../../../../application/protocols";
import { AjvValidationAdapter } from "../../../adapters";
import { ProductKnexRepository } from "../../../repositories";
import { makeAccessTokenDecorator } from "../../decorators";

export function makeFindProductController(): Controller {
  return makeAccessTokenDecorator(
    new FindProductController(
      new AjvValidationAdapter<FindProductRequest>({
        type: "object",
        required: ["query"],
        properties: {
          query: {
            type: "object",
            properties: {
              name: { type: "string", maxLength: 48, nullable: true },
            },
          },
        },
      }),
      new ProductKnexRepository(), // FindLikeNameProductRepository
    ),
  );
}
