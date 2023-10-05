import { randomInt } from "node:crypto";
import { Knex } from "knex";
import { Team } from "../../application/entities";
import { makeTeam } from "../../application/entities/team.mock";
import { makeUser } from "../../application/entities/user.mock";
import { makeJwt } from "../factories";
import { KnexHelper } from "../helpers";
import { removeId } from "../utils";

describe("Team Routes", () => {
  let knex: Knex;
  let accessToken: string;

  beforeAll(() => {
    knex = KnexHelper.getInstance().getClient();
    const user = makeUser();
    accessToken = makeJwt().sign({ sub: user.id, username: user.username });
  });

  beforeEach(async () => {
    await knex.raw('TRUNCATE "Team" RESTART IDENTITY CASCADE');
  });

  describe("GET /teams", () => {
    it("should find teams when success", async () => {
      const teams: [Team, Team, Team] = [
        { ...makeTeam(), id: 1 },
        { ...makeTeam(), id: 2 },
        { ...makeTeam(), id: 3 },
      ];

      await knex<Team>("Team").insert(teams.map(removeId));

      const response = await fetch(`${process.env.TEST_BASE_URL}/teams`, {
        headers: { "x-access-token": accessToken },
      });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(teams);
    });
  });

  describe("GET /teams/:teamId", () => {
    it("should find team when success", async () => {
      const teams: [Team, Team, Team] = [
        { ...makeTeam(), id: 1 },
        { ...makeTeam(), id: 2 },
        { ...makeTeam(), id: 3 },
      ];

      await knex<Team>("Team").insert(teams.map(removeId));

      const index = randomInt(teams.length) as 0 | 1 | 2;

      const response = await fetch(
        `${process.env.TEST_BASE_URL}/teams/${index + 1}`,
        { headers: { "x-access-token": accessToken } },
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(teams[index]);
    });
  });

  describe("POST /teams", () => {
    it("should create team when success", async () => {
      const team = makeTeam();

      const response = await fetch(`${process.env.TEST_BASE_URL}/teams`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-access-token": accessToken,
        },
        body: JSON.stringify({ name: team.name }),
      });

      const rows = await knex<Team>("Team");
      const expectedRows: Team[] = [{ ...team, id: 1 }];

      expect(response.status).toBe(200);
      expect(rows).toEqual(expectedRows);
    });
  });

  describe("PUT /teams/:teamId", () => {
    it("should update team when success", async () => {
      const team = makeTeam();
      const anotherTeam = makeTeam();
      const { name } = anotherTeam;

      await knex<Team>("Team").insert(removeId(team));

      const response = await fetch(`${process.env.TEST_BASE_URL}/teams/1`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          "x-access-token": accessToken,
        },
        body: JSON.stringify({ name }),
      });

      const rows = await knex<Team>("Team");
      const expectedRows: Team[] = [{ ...team, name, id: 1 }];

      expect(response.status).toBe(200);
      expect(rows).toEqual(expectedRows);
    });
  });
});
