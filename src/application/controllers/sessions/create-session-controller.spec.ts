import { randomUUID } from "node:crypto";
import { User } from "../../entities";
import { makeUser } from "../../entities/user.mock";
import { Request, Response } from "../../protocols";
import { FindOneByUsernameAndPasswordUserRepositorySpy } from "../../repositories/user-repository.mock";
import { Jwt } from "../../utils";
import { ValidationSpy } from "../../validations/validation.mock";

import {
  CreateSessionController,
  CreateSessionRequest,
} from "./create-session-controller";

describe("CreateSessionController", () => {
  let user: User;
  let secret: string;
  let request: Request & CreateSessionRequest;
  let validationSpy: ValidationSpy;
  let findOneByUsernameAndPasswordUserRepositorySpy: FindOneByUsernameAndPasswordUserRepositorySpy;
  let jwt: Jwt;
  let createSessionController: CreateSessionController;

  beforeEach(() => {
    user = makeUser();
    secret = randomUUID();

    request = {
      headers: {},
      params: {},
      query: {},
      body: { username: user.username, password: user.password },
    };

    validationSpy = new ValidationSpy();

    findOneByUsernameAndPasswordUserRepositorySpy =
      new FindOneByUsernameAndPasswordUserRepositorySpy();

    findOneByUsernameAndPasswordUserRepositorySpy.result = user;

    jwt = new Jwt(secret);

    createSessionController = new CreateSessionController(
      validationSpy,
      findOneByUsernameAndPasswordUserRepositorySpy,
      jwt,
    );
  });

  it("should fail when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await createSessionController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should fail when user or password is invalid", async () => {
    findOneByUsernameAndPasswordUserRepositorySpy.result = null;
    const response = await createSessionController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: "Usuário e/ou senha inválido(s)" },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should create session successfully", async () => {
    const response = await createSessionController.handle(request);

    const expectedResponse: Response = {
      statusCode: 200,
      body: {
        accessToken: jwt.sign({ sub: user.id, username: user.username }),
      },
    };

    expect(response).toEqual(expectedResponse);
  });
});
