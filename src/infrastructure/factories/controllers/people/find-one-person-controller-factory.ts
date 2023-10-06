import {
  FindOnePersonController,
  FindOnePersonRequest,
} from "../../../../application/controllers";

import { Controller } from "../../../../application/protocols";
import { AjvValidationAdapter } from "../../../adapters";
import { PersonKnexRepository } from "../../../repositories";

import {
  makeAccessTokenDecorator,
  makeLogErrorDecorator,
} from "../../decorators";

export function makeFindOnePersonController(): Controller {
  return makeLogErrorDecorator(
    makeAccessTokenDecorator(
      new FindOnePersonController(
        new AjvValidationAdapter<FindOnePersonRequest>({
          type: "object",
          required: ["params"],
          properties: {
            params: {
              type: "object",
              required: ["personId"],
              properties: {
                personId: { type: "string", pattern: "[0-9]+" },
              },
            },
          },
        }),
        new PersonKnexRepository(), // FindOneByIdPersonRepository
      ),
    ),
  );
}
