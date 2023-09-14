import type { Knex } from "knex";
import type { Person } from "../entities/Person";
import type { Team } from "../entities/Team";

export class PersonRepository {
  constructor(private readonly knex: Knex) {}

  async countById(id: number): Promise<number> {
    const [row] = await this.knex<Person>("Person")
      .where({ id })
      .count({ count: "*" });

    if (row === undefined) throw new Error("Unexpected undefined row");
    if (row.count === undefined) throw new Error("Unexpected undefined count");

    const count =
      typeof row.count === "string" ? Number.parseInt(row.count) : row.count;

    if (Number.isNaN(count)) throw new Error("Unexpected NaN count");

    return count;
  }

  async findILikeName(name: string): Promise<Array<Person & { team: Team }>> {
    return await this.knex<Person>({ p: "Person" })
      .select("p.*", this.knex.raw("ROW_TO_JSON(t.*)"))
      .join({ t: "Team" }, "t.id", "p.teamId")
      .whereILike("p.name", `%${name}%`)
      .orderBy(["p.id", "t.id"]);
  }

  async findILikeNameAndByTeamId(
    name: string,
    teamId: number,
  ): Promise<Array<Person & { team: Team }>> {
    return await this.knex<Person>({ p: "Person" })
      .select("p.*", this.knex.raw("ROW_TO_JSON(t.*)"))
      .join({ t: "Team" }, "t.id", "p.teamId")
      .whereILike("p.name", `%${name}%`)
      .andWhere("teamId", teamId)
      .orderBy(["p.id", "t.id"]);
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
