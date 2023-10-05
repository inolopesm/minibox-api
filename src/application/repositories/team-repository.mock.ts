import { Team } from "../entities";
import { makeTeam } from "../entities/team.mock";

import {
  CreateTeamRepository,
  FindLikeNameTeamRepository,
  FindOneByIdTeamRepository,
  UpdateNameByIdTeamRepository,
} from "./team-repository";

export class CreateTeamRepositorySpy implements CreateTeamRepository {
  name?: string;

  async create(name: string): Promise<void> {
    this.name = name;
  }
}

export class FindLikeNameTeamRepositorySpy
  implements FindLikeNameTeamRepository
{
  name?: string;
  result: Team[] = [makeTeam(), makeTeam(), makeTeam()];

  async findLikeName(name: string): Promise<Team[]> {
    this.name = name;
    return this.result;
  }
}

export class FindOneByIdTeamRepositorySpy implements FindOneByIdTeamRepository {
  id?: number;
  result: Team | null = makeTeam();

  async findOneById(id: number): Promise<Team | null> {
    this.id = id;
    return this.result;
  }
}

export class UpdateNameByIdTeamRepositorySpy
  implements UpdateNameByIdTeamRepository
{
  name?: string;
  id?: number;

  async updateNameById(name: string, id: number): Promise<void> {
    this.name = name;
    this.id = id;
  }
}
