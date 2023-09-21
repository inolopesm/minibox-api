import { type TeamRepository } from "../repositories/TeamRepository";
import { TeamService } from "./TeamService";

const jestFn = <T extends (...args: any[]) => any>(
  implementation?: (...args: Parameters<T>) => ReturnType<T>,
): jest.Mock<ReturnType<T>, Parameters<T>> => jest.fn(implementation);

const mapTeamName = (
  array: Awaited<ReturnType<TeamRepository["findILikeName"]>>,
  name: string,
): Awaited<ReturnType<TeamRepository["findILikeName"]>> =>
  array.map((p) => ({ ...p, name: `${p.name} ${name}` }));

describe("TeamService", () => {
  let teams: Awaited<ReturnType<TeamRepository["findILikeName"]>>;
  let team: NonNullable<Awaited<ReturnType<TeamRepository["findOneById"]>>>;

  let teamRepository: jest.Mocked<
    Pick<
      TeamRepository,
      "findILikeName" | "findOneById" | "create" | "updateNameById"
    >
  >;

  let teamService: TeamService;

  beforeEach(() => {
    teams = [
      {
        id: Number.parseInt(Math.random().toString().substring(2), 10),
        name: `Team ${Math.random().toString(36).substring(2)}`,
      },
      {
        id: Number.parseInt(Math.random().toString().substring(2), 10),
        name: `Team ${Math.random().toString(36).substring(2)}`,
      },
    ];

    team = {
      id: Number.parseInt(Math.random().toString().substring(2), 10),
      name: `Team ${Math.random().toString(36).substring(2)}`,
    };

    teamRepository = {
      findILikeName: jestFn<TeamRepository["findILikeName"]>(async (name) =>
        name !== "" ? mapTeamName(teams, name) : teams,
      ),

      findOneById: jestFn<TeamRepository["findOneById"]>(async (id) => ({
        ...team,
        id,
      })),

      create: jestFn<TeamRepository["create"]>(async () => {}),

      updateNameById: jestFn<TeamRepository["updateNameById"]>(async () => {}),
    };

    teamService = new TeamService(teamRepository as unknown as TeamRepository);
  });

  describe("find", () => {
    it("should return all teams if name is not provided", async () => {
      const result = await teamService.find();
      expect(teamRepository.findILikeName).toHaveBeenCalledTimes(1);
      expect(teamRepository.findILikeName).toHaveBeenCalledWith("");
      expect(result).toEqual(teams);
    });

    it("should return an array of teams matching the provided name", async () => {
      const name = Math.random().toString(36).substring(2);
      const result = await teamService.find(name);
      expect(teamRepository.findILikeName).toHaveBeenCalledTimes(1);
      expect(teamRepository.findILikeName).toHaveBeenCalledWith(name);
      expect(result).toEqual(mapTeamName(teams, name));
    });
  });

  describe("findOne", () => {
    it("should return a team when a valid id is provided", async () => {
      const result = await teamService.findOne(team.id);
      expect(result).toEqual(team);
    });

    it("should return an error when an invalid id is provided", async () => {
      teamRepository.findOneById.mockResolvedValueOnce(null);
      const id = Number.parseInt(Math.random().toString().substring(2), 10);
      const result = await teamService.findOne(id);
      expect(result).toEqual(new Error("Equipe não encontrada"));
    });
  });

  describe("create", () => {
    it("should create team with the provided name", async () => {
      const name = `Team ${Math.random().toString(36).substring(2)}`;
      await teamService.create(name);
      expect(teamRepository.create).toHaveBeenCalledTimes(1);
      expect(teamRepository.create).toHaveBeenCalledWith(name);
    });
  });

  describe("update", () => {
    it("should update team by id with the provided name", async () => {
      const id = Number.parseInt(Math.random().toString().substring(2), 10);
      const name = `Team ${Math.random().toString(36).substring(2)}`;
      await teamService.update(name, id);
      expect(teamRepository.updateNameById).toHaveBeenCalledTimes(1);
      expect(teamRepository.updateNameById).toHaveBeenCalledWith(name, id);
    });
  });
});
