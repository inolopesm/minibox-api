import type { Knex } from "knex";
import type { Person } from "../entities/Person";

export class PersonRepository {
  constructor(private readonly knex: Knex) {}

  async findILikeName(name: string): Promise<Person[]> {
    return await this.knex<Person>("Person")
      .whereILike("name", `%${name}%`)
      .orderBy("id");
  }

  async findOneById(id: number): Promise<Person | null> {
    const row = await this.knex<Person>("Person").where({ id }).first();
    return row ?? null;
  }

  async create(name: string, teamId: number): Promise<void> {
    await this.knex<Person>("Person").insert({ name, teamId });
  }

  async updateNameAndTeamIdById({
    name,
    teamId,
    id,
  }: {
    name: string;
    teamId: number;
    id: number;
  }): Promise<void> {
    await this.knex<Person>("Person").where({ id }).update({ name, teamId });
  }
}
