import {
  FindProductController,
  FindProductRequest,
} from "../../../../application/controllers";

import { Controller } from "../../../../application/protocols";
import { AjvValidationAdapter } from "../../../adapters";
import { ProductKnexRepository } from "../../../repositories";

import {
  makeAccessTokenDecorator,
  makeLogErrorDecorator,
} from "../../decorators";

export function makeFindProductController(): Controller {
  return makeLogErrorDecorator(
    makeAccessTokenDecorator(
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
    ),
  );
}
