import { Controller, Request, Response, Validation } from "../protocols";
import { Jwt } from "../utils";

export interface AccessTokenRequest {
  headers: { "x-access-token": string };
}

export class AccessTokenDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly validation: Validation,
    private readonly jwt: Jwt,
  ) {}

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return { statusCode: 400, body: { message: error.message } };
    }

    const accessToken = request.headers["x-access-token"] as string;
    const payloadOrError = this.jwt.verify(accessToken);

    if (payloadOrError instanceof Error) {
      return { statusCode: 400, body: { message: "Não autorizado" } };
    }

    return await this.controller.handle(request);
  }
}
