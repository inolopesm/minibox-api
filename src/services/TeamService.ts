import type { Team } from "../entities/Team";
import type { TeamRepository } from "../repositories/TeamRepository";

export class TeamService {
  constructor(private readonly teamRepository: TeamRepository) {}

  async find(name: string | undefined = ""): Promise<Team[]> {
    return await this.teamRepository.findILikeName(name);
  }

  async findOne(id: number): Promise<Team | Error> {
    const team = await this.teamRepository.findOneById(id);

    if (team === null) {
      return new Error("Equipe não encontrado");
    }

    return team;
  }

  async create(name: string): Promise<void> {
    await this.teamRepository.create(name);
  }

  async update(name: string, id: number): Promise<void> {
    await this.teamRepository.updateNameById(name, id);
  }
}
