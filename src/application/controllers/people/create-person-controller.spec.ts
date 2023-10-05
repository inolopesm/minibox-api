import { Person } from "../../entities";
import { makePerson } from "../../entities/person.mock";
import { Request, Response } from "../../protocols";
import { CreatePersonRepositorySpy } from "../../repositories/person-repository.mock";
import { FindOneByIdTeamRepositorySpy } from "../../repositories/team-repository.mock";
import { ValidationSpy } from "../../validations/validation.mock";

import {
  CreatePersonController,
  CreatePersonRequest,
} from "./create-person-controller";

describe("CreatePersonController", () => {
  let person: Person;
  let request: Request & CreatePersonRequest;
  let validationSpy: ValidationSpy;
  let findOneByIdTeamRepositorySpy: FindOneByIdTeamRepositorySpy;
  let createPersonRepositorySpy: CreatePersonRepositorySpy;
  let createPersonController: CreatePersonController;

  beforeEach(() => {
    person = makePerson();

    request = {
      headers: {},
      params: {},
      query: {},
      body: { name: person.name, teamId: person.teamId },
    };

    validationSpy = new ValidationSpy();
    findOneByIdTeamRepositorySpy = new FindOneByIdTeamRepositorySpy();
    createPersonRepositorySpy = new CreatePersonRepositorySpy();

    createPersonController = new CreatePersonController(
      validationSpy,
      findOneByIdTeamRepositorySpy,
      createPersonRepositorySpy,
    );
  });

  it("should fail when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await createPersonController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should fail when team is not found", async () => {
    findOneByIdTeamRepositorySpy.result = null;

    const response = await createPersonController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: "Equipe não encontrada" },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should create person successfully", async () => {
    const response = await createPersonController.handle(request);

    const expectedResponse: Response = { statusCode: 200 };

    expect(response).toEqual(expectedResponse);
    expect(createPersonRepositorySpy.name).toBe(person.name);
    expect(createPersonRepositorySpy.teamId).toBe(person.teamId);
  });
});
