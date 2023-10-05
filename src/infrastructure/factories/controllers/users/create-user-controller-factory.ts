import {
  CreateUserController,
  CreateUserRequest,
} from "../../../../application/controllers";

import { AjvValidationAdapter } from "../../../adapters";
import { API_KEY } from "../../../configs";
import { UserKnexRepository } from "../../../repositories";

export function makeCreateUserController(): CreateUserController {
  return new CreateUserController(
    new AjvValidationAdapter<CreateUserRequest>({
      type: "object",
      required: ["headers", "body"],
      properties: {
        headers: {
          type: "object",
          required: ["x-api-key"],
          properties: {
            "x-api-key": { type: "string", minLength: 1, maxLength: 255 },
          },
        },
        body: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: {
              type: "string",
              minLength: 1,
              maxLength: 24,
              pattern: "^[a-zA-Z0-9-_.]+$",
            },
            password: { type: "string", minLength: 1, maxLength: 24 },
          },
        },
      },
    }),
    API_KEY,
    new UserKnexRepository(), // CountByUsernameUserRepository
    new UserKnexRepository(), // CreateUserRepository
  );
}
