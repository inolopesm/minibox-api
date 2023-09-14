import type { Team } from "../entities/Team";
import type { Knex } from "knex";

export class TeamRepository {
  constructor(private readonly knex: Knex) {}

  async countById(id: number): Promise<number> {
    const [row] = await this.knex<Team>("Team")
      .where({ id })
      .count({ count: "*" });

    if (row === undefined) throw new Error("Unexpected undefined row");
    if (row.count === undefined) throw new Error("Unexpected undefined count");

    const count =
      typeof row.count === "string" ? Number.parseInt(row.count) : row.count;

    if (Number.isNaN(count)) throw new Error("Unexpected NaN count");

    return count;
  }

  async findILikeName(name: string): Promise<Team[]> {
    return await this.knex<Team>("Team")
      .whereILike("name", `%${name}%`)
      .orderBy("id");
  }

  async findOneById(id: number): Promise<Team | null> {
    const row = await this.knex<Team>("Team").where({ id }).first();
    return row ?? null;
  }

  async create(name: string): Promise<void> {
    await this.knex<Team>("Team").insert({ name });
  }

  async updateNameById(name: string, id: number): Promise<void> {
    await this.knex<Team>("Team").where({ id }).update({ name });
  }
}
