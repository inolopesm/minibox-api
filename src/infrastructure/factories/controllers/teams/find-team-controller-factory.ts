import {
  FindTeamController,
  FindTeamRequest,
} from "../../../../application/controllers";

import { Controller } from "../../../../application/protocols";
import { AjvValidationAdapter } from "../../../adapters";
import { TeamKnexRepository } from "../../../repositories";

import {
  makeAccessTokenDecorator,
  makeLogErrorDecorator,
} from "../../decorators";

export function makeFindTeamController(): Controller {
  return makeLogErrorDecorator(
    makeAccessTokenDecorator(
      new FindTeamController(
        new AjvValidationAdapter<FindTeamRequest>({
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
        new TeamKnexRepository(), // FindLikeNameTeamRepository
      ),
    ),
  );
}
