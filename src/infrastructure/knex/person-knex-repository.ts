import { type Team } from "../../application/entities/team";
import type { Person } from "../../application/entities/person";

import type {
  CreatePersonRepository,
  FindLikeNameAndTeamIdPersonRepository,
  FindLikeNamePersonRepository,
  FindOneByIdPersonRepository,
  UpdateNameAndTeamIdByIdPersonRepository,
} from "../../application/repositories/person-repository";

import type { Knex } from "knex";

export class PersonKnexRepository
  implements
    FindLikeNamePersonRepository,
    FindLikeNameAndTeamIdPersonRepository,
    FindOneByIdPersonRepository,
    CreatePersonRepository,
    UpdateNameAndTeamIdByIdPersonRepository
{
  constructor(private readonly knex: Knex) {}

  async findLikeName(name: string): Promise<Array<Person & { team: Team }>> {
    return await this.knex({ p: "Person" })
      .select("p.*", this.knex.raw("ROW_TO_JSON(t.*) team"))
      .join({ t: "Team" }, "t.id", "p.teamId")
      .whereILike("p.name", `%${name}%`)
      .orderBy(["p.id", "t.id"]);
  }

  async findLikeNameAndTeamId(
    name: string,
    teamId: number,
  ): Promise<Array<Person & { team: Team }>> {
    return await this.knex({ p: "Person" })
      .select("p.*", this.knex.raw("ROW_TO_JSON(t.*) team"))
      .join({ t: "Team" }, "t.id", "p.teamId")
      .whereILike("p.name", `%${name}%`)
      .andWhere("p.teamId", teamId)
      .orderBy(["p.id", "t.id"]);
  }

  async findOneById(id: number): Promise<Person | null> {
    const row = await this.knex<Person>("Person").where({ id }).first();
    if (row === undefined) return null;
    return row;
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
    await this.knex<Person>("Person").update({ name, teamId }).where({ id });
  }
}
