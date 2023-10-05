import {
  FindOneTeamController,
  FindOneTeamRequest,
} from "../../../../application/controllers";

import { Controller } from "../../../../application/protocols";
import { AjvValidationAdapter } from "../../../adapters";
import { TeamKnexRepository } from "../../../repositories";
import { makeAccessTokenDecorator } from "../../decorators";

export function makeFindOneTeamController(): Controller {
  return makeAccessTokenDecorator(
    new FindOneTeamController(
      new AjvValidationAdapter<FindOneTeamRequest>({
        type: "object",
        required: ["params"],
        properties: {
          params: {
            type: "object",
            required: ["teamId"],
            properties: {
              teamId: { type: "string", pattern: "[0-9]+" },
            },
          },
        },
      }),
      new TeamKnexRepository(), // FindOneByIdTeamRepository
    ),
  );
}
