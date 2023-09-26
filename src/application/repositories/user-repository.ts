import type { User } from "../entities/user";

export interface FindOneByUsernameAndPasswordUserRepository {
  findOneByUsernameAndPassword: (
    username: string,
    password: string,
  ) => Promise<User | null>;
}
