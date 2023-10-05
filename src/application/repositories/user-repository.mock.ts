import { User } from "../entities";
import { makeUser } from "../entities/user.mock";

import {
  CountByUsernameUserRepository,
  CreateUserRepository,
  FindOneByUsernameAndPasswordUserRepository,
} from "./user-repository";

export class CountByUsernameUserRepositorySpy
  implements CountByUsernameUserRepository
{
  username?: string;
  result: number = 0;

  async countByUsername(username: string): Promise<number> {
    this.username = username;
    return this.result;
  }
}

export class CreateUserRepositorySpy implements CreateUserRepository {
  username?: string;
  password?: string;

  async create(username: string, password: string): Promise<void> {
    this.username = username;
    this.password = password;
  }
}

export class FindOneByUsernameAndPasswordUserRepositorySpy
  implements FindOneByUsernameAndPasswordUserRepository
{
  username?: string;
  password?: string;
  result: User | null = makeUser();

  async findOneByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<User | null> {
    this.username = username;
    this.password = password;
    return this.result;
  }
}
