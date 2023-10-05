import { Team } from "../../entities";
import { makeTeam } from "../../entities/team.mock";
import { Request, Response } from "../../protocols";
import { FindOneByIdTeamRepositorySpy } from "../../repositories/team-repository.mock";
import { ValidationSpy } from "../../validations/validation.mock";

import {
  FindOneTeamController,
  FindOneTeamRequest,
} from "./find-one-team-controller";

describe("FindOneTeamController", () => {
  let team: Team;
  let request: Request & FindOneTeamRequest;
  let validationSpy: ValidationSpy;
  let findOneByIdTeamRepositorySpy: FindOneByIdTeamRepositorySpy;
  let findOneTeamController: FindOneTeamController;

  beforeEach(() => {
    team = makeTeam();

    request = {
      headers: {},
      params: { teamId: team.id.toString() },
      query: {},
      body: {},
    };

    validationSpy = new ValidationSpy();
    findOneByIdTeamRepositorySpy = new FindOneByIdTeamRepositorySpy();

    findOneTeamController = new FindOneTeamController(
      validationSpy,
      findOneByIdTeamRepositorySpy,
    );
  });

  it("should fail when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await findOneTeamController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should fail when team is not found", async () => {
    findOneByIdTeamRepositorySpy.result = null;

    const response = await findOneTeamController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: "Equipe não encontrada" },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should find team successfully", async () => {
    const response = await findOneTeamController.handle(request);

    const expectedResponse: Response = {
      statusCode: 200,
      body: findOneByIdTeamRepositorySpy.result,
    };

    expect(findOneByIdTeamRepositorySpy.id).toBe(team.id);
    expect(response).toEqual(expectedResponse);
  });
});
