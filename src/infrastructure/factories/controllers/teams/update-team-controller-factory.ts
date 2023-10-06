import {
  UpdateTeamController,
  UpdateTeamRequest,
} from "../../../../application/controllers";

import { Controller } from "../../../../application/protocols";
import { AjvValidationAdapter } from "../../../adapters";
import { TeamKnexRepository } from "../../../repositories";

import {
  makeAccessTokenDecorator,
  makeLogErrorDecorator,
} from "../../decorators";

export function makeUpdateTeamController(): Controller {
  return makeLogErrorDecorator(
    makeAccessTokenDecorator(
      new UpdateTeamController(
        new AjvValidationAdapter<UpdateTeamRequest>({
          type: "object",
          required: ["params", "body"],
          properties: {
            params: {
              type: "object",
              required: ["teamId"],
              properties: {
                teamId: { type: "string", pattern: "[0-9]+" },
              },
            },
            body: {
              type: "object",
              required: ["name"],
              properties: {
                name: { type: "string", minLength: 1, maxLength: 24 },
              },
            },
          },
        }),
        new TeamKnexRepository(), // UpdateNameByIdTeamRepository
      ),
    ),
  );
}
