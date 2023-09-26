import { JWT } from "../../utils/jwt";
import { CreateSessionController } from "./create-session-controller";
import type { User } from "../../entities/user";
import type { Request, Response } from "../../protocols/http";
import type { Validation } from "../../protocols/validation";
import type { FindOneByUsernameAndPasswordUserRepository } from "../../repositories/user-repository";

const SECRET = Math.random().toString(36).substring(2);

class ValidationSpy implements Validation {
  input?: unknown;
  result: Error | null = null;

  validate(input: unknown): Error | null {
    this.input = input;
    return this.result;
  }
}

class FindOneByUsernameAndPasswordUserRepositorySpy
  implements FindOneByUsernameAndPasswordUserRepository
{
  username?: string;
  password?: string;
  result: User | null;

  constructor(user: User) {
    this.result = user;
  }

  async findOneByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<User | null> {
    this.username = username;
    this.password = password;
    return this.result;
  }
}

describe("CreateSessionController", () => {
  let user: User;
  let request: Request;
  let validationSpy: ValidationSpy;
  let findOneByUsernameAndPasswordUserRepositorySpy: FindOneByUsernameAndPasswordUserRepositorySpy;
  let jwt: JWT;
  let createSessionController: CreateSessionController;

  beforeEach(() => {
    user = {
      id: Number(Math.random().toString().substring(2)),
      username: "username" + Math.random().toString(36).substring(2),
      password: Math.random().toString(36).substring(2),
    };

    request = {
      headers: {},
      path: {},
      query: {},
      body: { username: user.username, password: user.password },
    };

    validationSpy = new ValidationSpy();

    findOneByUsernameAndPasswordUserRepositorySpy =
      new FindOneByUsernameAndPasswordUserRepositorySpy(user);

    jwt = new JWT(SECRET);

    createSessionController = new CreateSessionController(
      validationSpy,
      findOneByUsernameAndPasswordUserRepositorySpy,
      jwt,
    );
  });

  it("should return an access token when given valid credentials", async () => {
    const response = await createSessionController.handle(request);
    const { id: sub, username } = user;

    const expectedResponse: Response = {
      statusCode: 200,
      body: { accessToken: jwt.sign({ sub, username }) },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should return an error when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await createSessionController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should return an error when given invalid credentials", async () => {
    findOneByUsernameAndPasswordUserRepositorySpy.result = null;
    const response = await createSessionController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: "Usuário e/ou senha inválido(s)" },
    };

    expect(response).toEqual(expectedResponse);
  });
});
