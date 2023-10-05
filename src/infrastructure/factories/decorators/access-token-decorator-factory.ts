import {
  AccessTokenDecorator,
  AccessTokenRequest,
} from "../../../application/decorators";

import { Controller } from "../../../application/protocols";
import { AjvValidationAdapter } from "../../adapters";
import { makeJwt } from "../utils";

export function makeAccessTokenDecorator(
  controller: Controller,
): AccessTokenDecorator {
  return new AccessTokenDecorator(
    controller,
    new AjvValidationAdapter<AccessTokenRequest>({
      type: "object",
      required: ["headers"],
      properties: {
        headers: {
          type: "object",
          required: ["x-access-token"],
          properties: { "x-access-token": { type: "string" } },
        },
      },
    }),
    makeJwt(),
  );
}
