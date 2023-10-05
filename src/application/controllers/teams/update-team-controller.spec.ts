import { Team } from "../../entities";
import { makeTeam } from "../../entities/team.mock";
import { Request, Response } from "../../protocols";
import { UpdateNameByIdTeamRepositorySpy } from "../../repositories/team-repository.mock";
import { ValidationSpy } from "../../validations/validation.mock";

import {
  UpdateTeamController,
  UpdateTeamRequest,
} from "./update-team-controller";

describe("UpdateTeamController", () => {
  let team: Team;
  let request: Request & UpdateTeamRequest;
  let validationSpy: ValidationSpy;
  let updateNameByIdTeamRepositorySpy: UpdateNameByIdTeamRepositorySpy;
  let updateTeamController: UpdateTeamController;

  beforeEach(() => {
    team = makeTeam();

    request = {
      headers: {},
      params: { teamId: team.id.toString() },
      query: {},
      body: { name: `${team.name} updated` },
    };

    validationSpy = new ValidationSpy();
    updateNameByIdTeamRepositorySpy = new UpdateNameByIdTeamRepositorySpy();

    updateTeamController = new UpdateTeamController(
      validationSpy,
      updateNameByIdTeamRepositorySpy,
    );
  });

  it("should return an error when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await updateTeamController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should update a team", async () => {
    const response = await updateTeamController.handle(request);
    const expectedResponse: Response = { statusCode: 200 };
    expect(response).toEqual(expectedResponse);
    expect(updateNameByIdTeamRepositorySpy.id).toBe(team.id);
    expect(updateNameByIdTeamRepositorySpy.name).toBe(`${team.name} updated`);
  });
});
