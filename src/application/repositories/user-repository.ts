import type { User } from "../entities/user";

export interface FindOneByUsernameAndPasswordUserRepository {
  findOneByUsernameAndPassword: (
    username: string,
    password: string,
  ) => Promise<User | null>;
}

export interface CreateUserRepository {
  create: (username: string, password: string) => Promise<void>;
}

export interface CountByUsernameUserRepository {
  countByUsername: (username: string) => Promise<number>;
}
