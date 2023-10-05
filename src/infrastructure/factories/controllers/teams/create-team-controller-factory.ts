import {
  CreateTeamController,
  CreateTeamRequest,
} from "../../../../application/controllers";

import { Controller } from "../../../../application/protocols";
import { AjvValidationAdapter } from "../../../adapters";
import { TeamKnexRepository } from "../../../repositories";
import { makeAccessTokenDecorator } from "../../decorators";

export function makeCreateTeamController(): Controller {
  return makeAccessTokenDecorator(
    new CreateTeamController(
      new AjvValidationAdapter<CreateTeamRequest>({
        type: "object",
        required: ["body"],
        properties: {
          body: {
            type: "object",
            required: ["name"],
            properties: {
              name: { type: "string", minLength: 1, maxLength: 24 },
            },
          },
        },
      }),
      new TeamKnexRepository(), // CreateTeamRepository
    ),
  );
}
