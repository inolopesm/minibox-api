import { randomUUID } from "node:crypto";
import { User } from "../../entities";
import { makeUser } from "../../entities/user.mock";
import { Request, Response } from "../../protocols";

import {
  CountByUsernameUserRepositorySpy,
  CreateUserRepositorySpy,
} from "../../repositories/user-repository.mock";

import { ValidationSpy } from "../../validations/validation.mock";

import {
  CreateUserController,
  CreateUserRequest,
} from "./create-user-controller";

describe("CreateUserController", () => {
  let user: User;
  let request: Request & CreateUserRequest;
  let validationSpy: ValidationSpy;
  let apiKey: string;
  let countByUsernameUserRepositorySpy: CountByUsernameUserRepositorySpy;
  let createUserRepositorySpy: CreateUserRepositorySpy;
  let createUserController: CreateUserController;

  beforeEach(() => {
    user = makeUser();
    apiKey = randomUUID();

    request = {
      headers: { "x-api-key": apiKey },
      params: {},
      query: {},
      body: { username: user.username, password: user.password },
    };

    validationSpy = new ValidationSpy();
    countByUsernameUserRepositorySpy = new CountByUsernameUserRepositorySpy();
    createUserRepositorySpy = new CreateUserRepositorySpy();

    createUserController = new CreateUserController(
      validationSpy,
      apiKey,
      countByUsernameUserRepositorySpy,
      createUserRepositorySpy,
    );
  });

  it("should fail when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await createUserController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should fail when API key is invalid", async () => {
    request.headers["x-api-key"] = randomUUID();
    const response = await createUserController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: "Não autorizado" },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should fail when username already exists", async () => {
    countByUsernameUserRepositorySpy.result = 1;
    const response = await createUserController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: "Usuário já existe" },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should create user successfully", async () => {
    const response = await createUserController.handle(request);
    const expectedResponse: Response = { statusCode: 200 };
    expect(response).toEqual(expectedResponse);
    expect(createUserRepositorySpy.username).toBe(user.username);
    expect(createUserRepositorySpy.password).toBe(user.password);
  });
});
