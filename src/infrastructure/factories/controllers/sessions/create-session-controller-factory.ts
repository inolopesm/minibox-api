import {
  CreateSessionController,
  CreateSessionRequest,
} from "../../../../application/controllers";

import { Controller } from "../../../../application/protocols";

import { ZodValidationAdapter } from "../../../adapters";
import { UserKnexRepository } from "../../../repositories";
import { makeLogErrorDecorator } from "../../decorators";
import { makeJwt } from "../../utils";

export function makeCreateSessionController(): Controller {
  return makeLogErrorDecorator(
    new CreateSessionController(
      new ZodValidationAdapter<CreateSessionRequest>(
        // prettier-ignore
        (z) => z.object({
          body: z.object({
            username: z.string(),
            password: z.string(),
          }).required(),
        }).required(),
      ),
      new UserKnexRepository(), // FindOneByUsernameAndPasswordUserRepository
      makeJwt(),
    ),
  );
}
