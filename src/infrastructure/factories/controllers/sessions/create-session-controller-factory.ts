import {
  CreateSessionController,
  CreateSessionRequest,
} from "../../../../application/controllers";

import { AjvValidationAdapter } from "../../../adapters";
import { UserKnexRepository } from "../../../repositories";
import { makeJwt } from "../../utils";

export function makeCreateSessionController(): CreateSessionController {
  return new CreateSessionController(
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
  );
}
