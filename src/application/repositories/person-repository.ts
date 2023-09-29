import type { Person } from "../entities/person";
import type { Team } from "../entities/team";

export interface FindLikeNamePersonRepository {
  findLikeName: (name: string) => Promise<Array<Person & { team: Team }>>;
}

export interface FindLikeNameAndTeamIdPersonRepository {
  findLikeNameAndTeamId: (
    name: string,
    teamId: number,
  ) => Promise<Array<Person & { team: Team }>>;
}

export interface CreatePersonRepository {
  create: (name: string, teamId: number) => Promise<void>;
}

export interface FindOneByIdPersonRepository {
  findOneById: (id: number) => Promise<Person | null>;
}

export interface UpdateNameAndTeamIdByIdPersonRepository {
  updateNameAndTeamIdById: ({
    name,
    teamId,
    id,
  }: {
    name: string;
    teamId: number;
    id: number;
  }) => Promise<void>;
}
