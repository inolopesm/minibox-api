import type { Knex } from "knex";
import type { User } from "../entities/User";

export class UserRepository {
  constructor(private readonly knex: Knex) {}

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
      typeof row.count === "string" ? Number.parseInt(row.count) : row.count;

    if (Number.isNaN(count)) {
      throw new Error("Unexpected NaN count");
    }

    return count;
  }

  async findOneByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.knex<User>("User")
      .where({ username, password })
      .first();

    return user ?? null;
  }

  async create({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<void> {
    await this.knex<User>("User").insert({ username, password });
  }
}
