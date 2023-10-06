import {
  CreatePersonController,
  CreatePersonRequest,
} from "../../../../application/controllers";

import { Controller } from "../../../../application/protocols";
import { AjvValidationAdapter } from "../../../adapters";

import {
  PersonKnexRepository,
  TeamKnexRepository,
} from "../../../repositories";

import {
  makeAccessTokenDecorator,
  makeLogErrorDecorator,
} from "../../decorators";

export function makeCreatePersonController(): Controller {
  return makeLogErrorDecorator(
    makeAccessTokenDecorator(
      new CreatePersonController(
        new AjvValidationAdapter<CreatePersonRequest>({
          type: "object",
          required: ["body"],
          properties: {
            body: {
              type: "object",
              required: ["name", "teamId"],
              properties: {
                name: { type: "string", minLength: 1, maxLength: 24 },
                teamId: { type: "integer", minimum: 1 },
              },
            },
          },
        }),
        new TeamKnexRepository(), // FindOneByIdTeamRepository
        new PersonKnexRepository(), // CreatePersonRepository
      ),
    ),
  );
}
