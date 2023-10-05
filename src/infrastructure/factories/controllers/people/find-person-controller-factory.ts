import {
  FindPersonController,
  FindPersonRequest,
} from "../../../../application/controllers";

import { Controller } from "../../../../application/protocols";
import { AjvValidationAdapter } from "../../../adapters";
import { PersonKnexRepository } from "../../../repositories";
import { makeAccessTokenDecorator } from "../../decorators";

export function makeFindPersonController(): Controller {
  return makeAccessTokenDecorator(
    new FindPersonController(
      new AjvValidationAdapter<FindPersonRequest>({
        type: "object",
        required: ["query"],
        properties: {
          query: {
            type: "object",
            properties: {
              name: { type: "string", maxLength: 24, nullable: true },
              teamId: { type: "string", pattern: "[0-9]+", nullable: true },
            },
          },
        },
      }),
      new PersonKnexRepository(), // FindLikeNamePersonRepository
      new PersonKnexRepository(), // FindLikeNameAndTeamIdPersonRepository
    ),
  );
}
