import { randomInt } from "node:crypto";
import { Knex } from "knex";
import { Person, Team } from "../../application/entities";
import { makePerson } from "../../application/entities/person.mock";
import { makeTeam } from "../../application/entities/team.mock";
import { makeUser } from "../../application/entities/user.mock";
import { makeJwt } from "../factories";
import { KnexHelper } from "../helpers";
import { removeId } from "../utils";

describe("Person Routes", () => {
  let knex: Knex;
  let accessToken: string;

  beforeAll(() => {
    knex = KnexHelper.getInstance().getClient();
    const user = makeUser();
    accessToken = makeJwt().sign({ sub: user.id, username: user.username });
  });

  beforeEach(async () => {
    await knex.raw('TRUNCATE "Team", "Person" RESTART IDENTITY CASCADE');
  });

  describe("GET /people", () => {
    it("should find people when success", async () => {
      const teams: Team[] = [
        { ...makeTeam(), id: 1 },
        { ...makeTeam(), id: 2 },
      ];

      const people: Person[] = [
        { ...makePerson(), id: 1, teamId: 1 },
        { ...makePerson(), id: 2, teamId: 1 },
        { ...makePerson(), id: 3, teamId: 2 },
        { ...makePerson(), id: 4, teamId: 2 },
      ];

      await knex<Team>("Team").insert(teams.map(removeId));
      await knex<Person>("Person").insert(people.map(removeId));

      const response = await fetch(`${process.env.TEST_BASE_URL}/people`, {
        headers: { "x-access-token": accessToken },
      });

      const personDtos = people.map<Person & { team: Team }>((person) => {
        const team = teams.find((t) => t.id === person.teamId);
        if (team === undefined) throw new Error("unexpected undefined team");
        return { ...person, team };
      });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(personDtos);
    });
  });

  describe("GET /people/:personId", () => {
    it("should find person when success", async () => {
      const teams: Team[] = [
        { ...makeTeam(), id: 1 },
        { ...makeTeam(), id: 2 },
      ];

      const people: Person[] = [
        { ...makePerson(), id: 1, teamId: 1 },
        { ...makePerson(), id: 2, teamId: 1 },
        { ...makePerson(), id: 3, teamId: 2 },
        { ...makePerson(), id: 4, teamId: 2 },
      ];

      await knex<Team>("Team").insert(teams.map(removeId));
      await knex<Person>("Person").insert(people.map(removeId));

      const index = randomInt(people.length) as 0 | 1 | 2 | 3;

      const response = await fetch(
        `${process.env.TEST_BASE_URL}/people/${index + 1}`,
        { headers: { "x-access-token": accessToken } },
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(people[index]);
    });
  });

  describe("POST /people", () => {
    it("should create person when success", async () => {
      await knex<Team>("Team").insert(removeId(makeTeam()));

      const person = makePerson();
      const { name } = person;

      const response = await fetch(`${process.env.TEST_BASE_URL}/people`, {
        method: "POST",
        headers: { "x-access-token": accessToken },
        body: JSON.stringify({ name, teamId: 1 }),
      });

      const rows = await knex<Person>("Person");
      const expectedRows: Person[] = [{ ...person, teamId: 1, id: 1 }];

      expect(response.status).toBe(200);
      expect(rows).toEqual(expectedRows);
    });
  });

  describe("PUT /people/:personId", () => {
    it("should update person when success", async () => {
      await knex<Team>("Team").insert([
        removeId(makeTeam()),
        removeId(makeTeam()),
      ]);

      const person = makePerson();

      const anotherPerson = makePerson();
      const { name } = anotherPerson;

      await knex<Person>("Person").insert({ ...removeId(person), teamId: 1 });

      const response = await fetch(`${process.env.TEST_BASE_URL}/people/1`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          "x-access-token": accessToken,
        },
        body: JSON.stringify({ name, teamId: 2 }),
      });

      const rows = await knex<Person>("Person");
      const expectedRows: Person[] = [{ ...person, name, teamId: 2, id: 1 }];

      expect(response.status).toBe(200);
      expect(rows).toEqual(expectedRows);
    });
  });
});
