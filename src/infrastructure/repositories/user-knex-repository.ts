import { User } from "../../application/entities/user";

import {
  CountByUsernameUserRepository,
  CreateUserRepository,
  FindOneByUsernameAndPasswordUserRepository,
} from "../../application/repositories/user-repository";

import { KnexHelper } from "../helpers";

export class UserKnexRepository
  implements
    FindOneByUsernameAndPasswordUserRepository,
    CountByUsernameUserRepository,
    CreateUserRepository
{
  private readonly knex = KnexHelper.getInstance().getClient();

  async findOneByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.knex<User>("User")
      .where({ username, password })
      .first();

    return user ?? null;
  }

  async countByUsername(username: string): Promise<number> {
    const [row] = await this.knex<User>("User")
      .where({ username })
      .count({ count: "*" });

    if (row === undefined) {
      throw new Error("Unexpected undefined row");
    }

    if (row.count === undefined) {
      throw new Error("Unexpected undefined count");
    }

    const count =
      typeof row.count === "string"
        ? Number.parseInt(row.count, 10)
        : row.count;

    if (Number.isNaN(count)) {
      throw new Error("Unexpected NaN count");
    }

    return count;
  }

  async create(username: string, password: string): Promise<void> {
    await this.knex<User>("User").insert({ username, password });
  }
}
