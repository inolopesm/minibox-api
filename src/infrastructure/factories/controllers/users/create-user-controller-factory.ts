import {
  CreateUserController,
  CreateUserRequest,
} from "../../../../application/controllers";

import { Controller } from "../../../../application/protocols";
import { ZodValidationAdapter } from "../../../adapters";
import { API_KEY } from "../../../configs";
import { UserKnexRepository } from "../../../repositories";
import { makeLogErrorDecorator } from "../../decorators";

export function makeCreateUserController(): Controller {
  return makeLogErrorDecorator(
    new CreateUserController(
      new ZodValidationAdapter<CreateUserRequest>(
        // prettier-ignore
        (z) => z.object({
          headers: z.object({
            "x-api-key": z.string().min(1)
          }).required(),
          body: z.object({
            username: z.string().min(1).max(24).regex(/^[a-zA-Z0-9-_.]+$/),
            password: z.string().min(1).max(255),
          }).required(),
        }).required(),
      ),
      API_KEY,
      new UserKnexRepository(), // CountByUsernameUserRepository
      new UserKnexRepository(), // CreateUserRepository
    ),
  );
}
