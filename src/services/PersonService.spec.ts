import { PersonService } from "./PersonService";
import type { PersonRepository } from "../repositories/PersonRepository";
import type { TeamRepository } from "../repositories/TeamRepository";

const jestFn = <T extends (...args: any[]) => any>(
  implementation?: (...args: Parameters<T>) => ReturnType<T>,
): jest.Mock<ReturnType<T>, Parameters<T>> => jest.fn(implementation);

const mapPersonName = (
  array: Awaited<ReturnType<PersonRepository["findILikeName"]>>,
  name: string,
): Awaited<ReturnType<PersonRepository["findILikeName"]>> =>
  array.map((p) => ({ ...p, name: `${p.name} ${name}` }));

const mapPersonTeamId = (
  array: Awaited<ReturnType<PersonRepository["findILikeName"]>>,
  teamId: number,
): Awaited<ReturnType<PersonRepository["findILikeName"]>> =>
  array.map((p) => ({ ...p, teamId, team: { ...p.team, id: teamId } }));

describe("PersonService", () => {
  let people: Awaited<ReturnType<PersonRepository["findILikeName"]>>;
  let person: NonNullable<Awaited<ReturnType<PersonRepository["findOneById"]>>>;

  let personRepository: jest.Mocked<
    Pick<
      PersonRepository,
      | "findILikeName"
      | "findILikeNameAndByTeamId"
      | "findOneById"
      | "create"
      | "updateNameAndTeamIdById"
    >
  >;

  let teamRepository: jest.Mocked<Pick<TeamRepository, "countById">>;

  let personService: PersonService;

  beforeEach(() => {
    people = [
      {
        id: Number.parseInt(Math.random().toString().substring(2), 10),
        name: `Person ${Math.random().toString(36).substring(2)}`,
        teamId: Number.parseInt(Math.random().toString().substring(2), 10),
        team: {
          id: Number.parseInt(Math.random().toString().substring(2), 10),
          name: `Team  ${Math.random().toString(36).substring(2)}`,
        },
      },
      {
        id: Number.parseInt(Math.random().toString().substring(2), 10),
        name: `Person ${Math.random().toString(36).substring(2)}`,
        teamId: Number.parseInt(Math.random().toString().substring(2), 10),
        team: {
          id: Number.parseInt(Math.random().toString().substring(2), 10),
          name: `Team  ${Math.random().toString(36).substring(2)}`,
        },
      },
    ];

    person = {
      id: Number.parseInt(Math.random().toString().substring(2), 10),
      name: `Person ${Math.random().toString(36).substring(2)}`,
      teamId: Number.parseInt(Math.random().toString().substring(2), 10),
    };

    personRepository = {
      findILikeName: jestFn<PersonRepository["findILikeName"]>(async (name) =>
        name !== "" ? mapPersonName(people, name) : people,
      ),

      findILikeNameAndByTeamId: jestFn<
        PersonRepository["findILikeNameAndByTeamId"]
      >(async (name, teamId) =>
        mapPersonTeamId(
          name !== "" ? mapPersonName(people, name) : people,
          teamId,
        ),
      ),

      findOneById: jestFn<PersonRepository["findOneById"]>(async (id) => ({
        ...person,
        id,
      })),

      create: jestFn<PersonRepository["create"]>(async () => {}),

      updateNameAndTeamIdById: jestFn<
        PersonRepository["updateNameAndTeamIdById"]
      >(async () => {}),
    };

    teamRepository = {
      countById: jestFn<TeamRepository["countById"]>(async () => 1),
    };

    personService = new PersonService(
      personRepository as unknown as PersonRepository,
      teamRepository as unknown as TeamRepository,
    );
  });

  describe("find", () => {
    it("should return all people if name and teamId is not provided", async () => {
      const result = await personService.find(undefined, undefined);
      expect(personRepository.findILikeName).toHaveBeenCalledTimes(1);
      expect(personRepository.findILikeName).toHaveBeenCalledWith("");
      expect(result).toEqual(people);
    });

    it("should return an array of people matching the provided name", async () => {
      const name = Math.random().toString(36).substring(2);
      const result = await personService.find(name, undefined);
      expect(personRepository.findILikeName).toHaveBeenCalledTimes(1);
      expect(personRepository.findILikeName).toHaveBeenCalledWith(name);
      expect(result).toEqual(mapPersonName(people, name));
    });

    it("should return an array of people with the provided teamId", async () => {
      const teamId = Number.parseInt(Math.random().toString().substring(2), 10);
      const result = await personService.find(undefined, teamId);

      expect(personRepository.findILikeNameAndByTeamId).toHaveBeenCalledTimes(
        1,
      );

      expect(personRepository.findILikeNameAndByTeamId).toHaveBeenCalledWith(
        "",
        teamId,
      );

      expect(result).toEqual(mapPersonTeamId(people, teamId));
    });

    it("should return an array of people matching the provided name and with the provided teamId", async () => {
      const name = Math.random().toString(36).substring(2);
      const teamId = Number.parseInt(Math.random().toString().substring(2), 10);
      const result = await personService.find(name, teamId);

      expect(personRepository.findILikeNameAndByTeamId).toHaveBeenCalledTimes(
        1,
      );

      expect(personRepository.findILikeNameAndByTeamId).toHaveBeenCalledWith(
        name,
        teamId,
      );

      expect(result).toEqual(
        mapPersonTeamId(mapPersonName(people, name), teamId),
      );
    });
  });

  describe("findOne", () => {
    it("should return a person when a valid id is provided", async () => {
      const result = await personService.findOne(person.id);
      expect(result).toEqual(person);
    });

    it("should return an error when an invalid id is provided", async () => {
      personRepository.findOneById.mockResolvedValueOnce(null);
      const id = Number.parseInt(Math.random().toString().substring(2), 10);
      const result = await personService.findOne(id);
      expect(result).toEqual(new Error("Pessoa não encontrada"));
    });
  });

  describe("create", () => {
    it("should return an error when an invalid teamId is provided", async () => {
      teamRepository.countById.mockResolvedValueOnce(0);
      const name = `Person ${Math.random().toString(36).substring(2)}`;
      const teamId = Number.parseInt(Math.random().toString().substring(2), 10);
      const result = await personService.create(name, teamId);
      expect(teamRepository.countById).toHaveBeenCalledTimes(1);
      expect(teamRepository.countById).toHaveBeenCalledWith(teamId);
      expect(result).toEqual(new Error("Equipe não encontrada"));
    });

    it("should create person with the provided name and teamId", async () => {
      const name = `Person ${Math.random().toString(36).substring(2)}`;
      const teamId = Number.parseInt(Math.random().toString().substring(2), 10);
      const result = await personService.create(name, teamId);
      expect(personRepository.create).toHaveBeenCalledTimes(1);
      expect(personRepository.create).toHaveBeenCalledWith(name, teamId);
      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    const params = {
      id: Number.parseInt(Math.random().toString().substring(2), 10),
      name: `Person ${Math.random().toString(36).substring(2)}`,
      teamId: Number.parseInt(Math.random().toString().substring(2), 10),
    };

    it("should return an error when an invalid teamId is provided", async () => {
      teamRepository.countById.mockResolvedValueOnce(0);
      const result = await personService.update(params);
      expect(teamRepository.countById).toHaveBeenCalledTimes(1);
      expect(teamRepository.countById).toHaveBeenCalledWith(params.teamId);
      expect(result).toEqual(new Error("Equipe não encontrada"));
    });

    it("should update person by id with the provided name and teamId", async () => {
      await personService.update(params);

      expect(personRepository.updateNameAndTeamIdById).toHaveBeenCalledTimes(1);

      expect(personRepository.updateNameAndTeamIdById).toHaveBeenCalledWith(
        params,
      );
    });
  });
});
