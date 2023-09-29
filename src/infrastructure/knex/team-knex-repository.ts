import type { Team } from "../../application/entities/team";

import type {
  CreateTeamRepository,
  FindLikeNameTeamRepository,
  FindOneByIdTeamRepository,
  FindTeamRepository,
  UpdateNameByIdTeamRepository,
} from "../../application/repositories/team-repository";

import type { Knex } from "knex";

export class TeamKnexRepository
  implements
    FindTeamRepository,
    FindLikeNameTeamRepository,
    FindOneByIdTeamRepository,
    CreateTeamRepository,
    UpdateNameByIdTeamRepository
{
  constructor(private readonly knex: Knex) {}

  async find(): Promise<Team[]> {
    return await this.knex<Team>("Team").orderBy("id");
  }

  async findLikeName(name: string): Promise<Team[]> {
    return await this.knex<Team>("Team")
      .whereILike("name", `%${name}%`)
      .orderBy("id");
  }

  async findOneById(id: number): Promise<Team | null> {
    const row = await this.knex<Team>("Team").where({ id }).first();
    if (row === undefined) return null;
    return row;
  }

  async create(name: string): Promise<void> {
    await this.knex<Team>("Team").insert({ name });
  }

  async updateNameById(name: string, id: number): Promise<void> {
    await this.knex<Team>("Team").update({ name }).where({ id });
  }
}
