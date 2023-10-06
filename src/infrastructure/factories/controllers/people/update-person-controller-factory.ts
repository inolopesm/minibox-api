import {
  UpdatePersonController,
  UpdatePersonRequest,
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

export function makeUpdatePersonController(): Controller {
  return makeLogErrorDecorator(
    makeAccessTokenDecorator(
      new UpdatePersonController(
        new AjvValidationAdapter<UpdatePersonRequest>({
          type: "object",
          required: ["params", "body"],
          properties: {
            params: {
              type: "object",
              required: ["personId"],
              properties: {
                personId: { type: "string", pattern: "[0-9]+" },
              },
            },
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
        new PersonKnexRepository(), // UpdateNameAndTeamIdByIdPersonRepository
      ),
    ),
  );
}
