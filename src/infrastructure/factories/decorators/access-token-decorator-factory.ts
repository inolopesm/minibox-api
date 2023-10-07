import {
  AccessTokenDecorator,
  AccessTokenRequest,
} from "../../../application/decorators";

import { Controller } from "../../../application/protocols";
import { ZodValidationAdapter } from "../../adapters";
import { makeJwt } from "../utils";

export function makeAccessTokenDecorator(
  controller: Controller,
): AccessTokenDecorator {
  return new AccessTokenDecorator(
    controller,
    new ZodValidationAdapter<AccessTokenRequest>(
      // prettier-ignore
      (z) => z
        .object({ headers: z.object({ "x-access-token": z.string().min(1) }).required() })
        .required(),
    ),
    makeJwt(),
  );
}
