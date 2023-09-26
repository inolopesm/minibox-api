import type { Controller, Request, Response } from "../../protocols/http";
import type { Validation } from "../../protocols/validation";
import type { FindOneByUsernameAndPasswordUserRepository } from "../../repositories/user-repository";
import type { JWT } from "../../utils/jwt";

export interface CreateSessionRequestBody {
  username: string;
  password: string;
}

export class CreateSessionController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly findOneByUsernameAndPasswordUserRepository: FindOneByUsernameAndPasswordUserRepository,
    private readonly jwt: JWT,
  ) {}

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return { statusCode: 400, body: { message: error.message } };
    }

    const { username, password } = request.body as CreateSessionRequestBody;

    const user =
      await this.findOneByUsernameAndPasswordUserRepository.findOneByUsernameAndPassword(
        username,
        password,
      );

    if (user === null) {
      return {
        statusCode: 400,
        body: { message: "Usuário e/ou senha inválido(s)" },
      };
    }

    const accessToken = this.jwt.sign({ sub: user.id, username });

    return { statusCode: 200, body: { accessToken } };
  }
}
