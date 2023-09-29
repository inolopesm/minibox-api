import { CreateUserController } from "./create-user-controller";
import type { Request, Response } from "../../protocols/http";
import type { Validation } from "../../protocols/validation";

import type {
  CountByUsernameUserRepository,
  CreateUserRepository,
} from "../../repositories/user-repository";

const API_KEY = Math.random().toString(36).substring(2);

class ValidationSpy implements Validation {
  input?: unknown;
  result: Error | null = null;

  validate(input: unknown): Error | null {
    this.input = input;
    return this.result;
  }
}

class CountByUsernameUserRepositorySpy
  implements CountByUsernameUserRepository
{
  username?: string;
  result = 0;

  async countByUsername(username: string): Promise<number> {
    this.username = username;
    return this.result;
  }
}

class CreateUserRepositorySpy implements CreateUserRepository {
  username?: string;
  password?: string;

  async create(username: string, password: string): Promise<void> {
    this.username = username;
    this.password = password;
  }
}

describe("CreateUserController", () => {
  let username: string;
  let password: string;
  let request: Request;
  let validationSpy: ValidationSpy;
  let countByUsernameUserRepositorySpy: CountByUsernameUserRepositorySpy;
  let createUserRepositorySpy: CreateUserRepositorySpy;
  let createUserController: CreateUserController;

  beforeEach(() => {
    username = "username" + Math.random().toString(36).substring(2);
    password = Math.random().toString(36).substring(2);

    request = {
      headers: { "x-api-key": API_KEY },
      params: {},
      query: {},
      body: { username, password },
    };

    validationSpy = new ValidationSpy();
    countByUsernameUserRepositorySpy = new CountByUsernameUserRepositorySpy();
    createUserRepositorySpy = new CreateUserRepositorySpy();

    createUserController = new CreateUserController(
      validationSpy,
      API_KEY,
      countByUsernameUserRepositorySpy,
      createUserRepositorySpy,
    );
  });

  it("should create a new user when username is not taken", async () => {
    const response = await createUserController.handle(request);
    const expectedResponse: Response = { statusCode: 200 };
    expect(response).toEqual(expectedResponse);
    expect(createUserRepositorySpy.username).toBe(username);
    expect(createUserRepositorySpy.password).toBe(password);
  });

  it("should return an error when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await createUserController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should return an error when api key is invalid", async () => {
    request.headers["x-api-key"] = Math.random().toString(36).substring(2);
    const response = await createUserController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: "Não autorizado" },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should return an error when username is already taken", async () => {
    countByUsernameUserRepositorySpy.result = 1;
    const response = await createUserController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: "Usuário já existe" },
    };

    expect(response).toEqual(expectedResponse);
  });
});
