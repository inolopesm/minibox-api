import { Team } from "../../entities";
import { makeTeam } from "../../entities/team.mock";
import { Request, Response } from "../../protocols";
import { FindLikeNameTeamRepositorySpy } from "../../repositories/team-repository.mock";
import { ValidationSpy } from "../../validations/validation.mock";
import { FindTeamController, FindTeamRequest } from "./find-team-controller";

describe("FindTeamController", () => {
  let team: Team;
  let request: Request & FindTeamRequest;
  let validationSpy: ValidationSpy;
  let findLikeNameTeamRepositorySpy: FindLikeNameTeamRepositorySpy;
  let findTeamController: FindTeamController;

  beforeEach(() => {
    team = makeTeam();
    request = { headers: {}, params: {}, query: {}, body: {} };

    validationSpy = new ValidationSpy();
    findLikeNameTeamRepositorySpy = new FindLikeNameTeamRepositorySpy();

    findTeamController = new FindTeamController(
      validationSpy,
      findLikeNameTeamRepositorySpy,
    );
  });

  it("should fail when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await findTeamController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should find teams by name successfully", async () => {
    {
      const response = await findTeamController.handle(request);

      const expectedResponse: Response = {
        statusCode: 200,
        body: findLikeNameTeamRepositorySpy.result,
      };

      expect(response).toEqual(expectedResponse);
      expect(findLikeNameTeamRepositorySpy.name).toBe("");
    }

    {
      request.query.name = team.name;
      const response = await findTeamController.handle(request);

      const expectedResponse: Response = {
        statusCode: 200,
        body: findLikeNameTeamRepositorySpy.result,
      };

      expect(response).toEqual(expectedResponse);
      expect(findLikeNameTeamRepositorySpy.name).toBe(request.query.name);
    }
  });
});
