import type { Knex } from "knex";
import type { Team } from "../entities/Team";

export class TeamRepository {
  constructor(private readonly knex: Knex) {}

  async find(): Promise<Team[]> {
    return await this.knex<Team>("Team").orderBy("id");
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
