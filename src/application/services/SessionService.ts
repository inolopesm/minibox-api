import type { UserRepository } from "../repositories/UserRepository";
import type { JWT } from "../utils/JWT";

export class SessionService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwt: JWT,
  ) {}

  async create(
    username: string,
    password: string,
  ): Promise<{ accessToken: string } | Error> {
    const user = await this.userRepository.findOneByUsernameAndPassword(
      username,
      password,
    );

    if (user === null) {
      return new Error("Usuário e/ou senha inválido(s)");
    }

    const accessToken = this.jwt.sign({
      sub: user.id,
      username,
      admin: user.admin,
    });

    return { accessToken };
  }
}
