import { Person } from "../entities/person";
import { makePerson } from "../entities/person.mock";
import { Team } from "../entities/team";
import { makeTeam } from "../entities/team.mock";

import {
  CreatePersonRepository,
  FindLikeNameAndTeamIdPersonRepository,
  FindLikeNamePersonRepository,
  FindOneByIdPersonRepository,
  UpdateNameAndTeamIdByIdPersonRepository,
} from "./person-repository";

export class FindLikeNamePersonRepositorySpy
  implements FindLikeNamePersonRepository
{
  name?: string;

  result: Array<Person & { team: Team }> = [
    { ...makePerson(), team: makeTeam() },
    { ...makePerson(), team: makeTeam() },
    { ...makePerson(), team: makeTeam() },
  ];

  async findLikeName(name: string): Promise<Array<Person & { team: Team }>> {
    this.name = name;
    return this.result;
  }
}

export class FindLikeNameAndTeamIdPersonRepositorySpy
  implements FindLikeNameAndTeamIdPersonRepository
{
  name?: string;
  teamId?: number;

  result: Array<Person & { team: Team }> = [
    { ...makePerson(), team: makeTeam() },
    { ...makePerson(), team: makeTeam() },
    { ...makePerson(), team: makeTeam() },
  ];

  async findLikeNameAndTeamId(
    name: string,
    teamId: number,
  ): Promise<Array<Person & { team: Team }>> {
    this.name = name;
    this.teamId = teamId;
    return this.result;
  }
}

export class CreatePersonRepositorySpy implements CreatePersonRepository {
  name?: string;
  teamId?: number;

  async create(name: string, teamId: number): Promise<void> {
    this.name = name;
    this.teamId = teamId;
  }
}

export class FindOneByIdPersonRepositorySpy
  implements FindOneByIdPersonRepository
{
  id?: number;
  result: Person | null = makePerson();

  async findOneById(id: number): Promise<Person | null> {
    this.id = id;
    return this.result;
  }
}

export class UpdateNameAndTeamIdByIdPersonRepositorySpy
  implements UpdateNameAndTeamIdByIdPersonRepository
{
  params?: { id: number; name: string; teamId: number };

  async updateNameAndTeamIdById(params: {
    name: string;
    teamId: number;
    id: number;
  }): Promise<void> {
    this.params = params;
  }
}
