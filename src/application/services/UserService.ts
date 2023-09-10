import type { UserRepository } from "../repositories/UserRepository";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create({
    username,
    password,
    admin,
  }: {
    username: string;
    password: string;
    admin: boolean;
  }): Promise<Error | null> {
    const count = await this.userRepository.countByUsername(username);

    if (count > 0) {
      return new Error("Usuário já existe");
    }

    await this.userRepository.create({ username, password, admin });

    return null;
  }
}
