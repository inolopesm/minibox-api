import { Team } from "../../entities";
import { makeTeam } from "../../entities/team.mock";
import { Request, Response } from "../../protocols";
import { CreateTeamRepositorySpy } from "../../repositories/team-repository.mock";
import { ValidationSpy } from "../../validations/validation.mock";

import {
  CreateTeamController,
  CreateTeamRequest,
} from "./create-team-controller";

describe("CreateTeamController", () => {
  let team: Team;
  let request: Request & CreateTeamRequest;
  let validationSpy: ValidationSpy;
  let createTeamRepositorySpy: CreateTeamRepositorySpy;
  let createTeamController: CreateTeamController;

  beforeEach(() => {
    team = makeTeam();

    request = {
      headers: {},
      params: {},
      query: {},
      body: { name: team.name },
    };

    validationSpy = new ValidationSpy();
    createTeamRepositorySpy = new CreateTeamRepositorySpy();

    createTeamController = new CreateTeamController(
      validationSpy,
      createTeamRepositorySpy,
    );
  });

  it("should return an error when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await createTeamController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should create a new team", async () => {
    const response = await createTeamController.handle(request);
    const expectedResponse: Response = { statusCode: 200 };
    expect(response).toEqual(expectedResponse);
    expect(createTeamRepositorySpy.name).toBe(team.name);
  });
});
