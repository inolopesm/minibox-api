import {
  CreateSessionController,
  CreateSessionRequest,
} from "../../../../application/controllers";

import { Controller } from "../../../../application/protocols";

import { AjvValidationAdapter } from "../../../adapters";
import { UserKnexRepository } from "../../../repositories";
import { makeLogErrorDecorator } from "../../decorators";
import { makeJwt } from "../../utils";

export function makeCreateSessionController(): Controller {
  return makeLogErrorDecorator(
    new CreateSessionController(
      new AjvValidationAdapter<CreateSessionRequest>({
        type: "object",
        required: ["body"],
        properties: {
          body: {
            type: "object",
            required: ["username", "password"],
            properties: {
              username: { type: "string", minLength: 1, maxLength: 24 },
              password: { type: "string", minLength: 1, maxLength: 24 },
            },
          },
        },
      }),
      new UserKnexRepository(), // FindOneByUsernameAndPasswordUserRepository
      makeJwt(),
    ),
  );
}
