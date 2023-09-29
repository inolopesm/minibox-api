import type { Team } from "../entities/team";

export interface FindTeamRepository {
  find: () => Promise<Team[]>;
}

export interface FindLikeNameTeamRepository {
  findLikeName: (name: string) => Promise<Team[]>;
}

export interface CreateTeamRepository {
  create: (name: string) => Promise<void>;
}

export interface FindOneByIdTeamRepository {
  findOneById: (id: number) => Promise<Team | null>;
}

export interface UpdateNameByIdTeamRepository {
  updateNameById: (name: string, id: number) => Promise<void>;
}
