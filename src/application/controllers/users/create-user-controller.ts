import type { Controller, Request, Response } from "../../protocols/http";
import type { Validation } from "../../protocols/validation";

import type {
  CreateUserRepository,
  CountByUsernameUserRepository,
} from "../../repositories/user-repository";

export interface CreateUserRequest {
  headers: { "x-api-key": string };
  body: { username: string; password: string };
}

export class CreateUserController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly apiKey: string,
    private readonly countByUsernameUserRepository: CountByUsernameUserRepository,
    private readonly createUserRepository: CreateUserRepository,
  ) {}

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return { statusCode: 400, body: { message: error.message } };
    }

    const apiKey = request.headers["x-api-key"];

    if (apiKey !== this.apiKey) {
      return { statusCode: 400, body: { message: "Não autorizado" } };
    }

    const { username, password } = request.body as CreateUserRequest["body"];

    const count =
      await this.countByUsernameUserRepository.countByUsername(username);

    if (count > 0) {
      return { statusCode: 400, body: { message: "Usuário já existe" } };
    }

    await this.createUserRepository.create(username, password);

    return { statusCode: 200 };
  }
}
