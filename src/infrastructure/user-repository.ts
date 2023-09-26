import type { User } from "../application/entities/user";
import type { FindOneByUsernameAndPasswordUserRepository } from "../application/repositories/user-repository";
import type { Knex } from "knex";

export class UserRepository
  implements FindOneByUsernameAndPasswordUserRepository
{
  constructor(private readonly knex: Knex) {}

  async findOneByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.knex<User>("User")
      .where({ username, password })
      .first();

    return user ?? null;
  }
}
