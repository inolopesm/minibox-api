import { Person } from "../../entities";
import { makePerson } from "../../entities/person.mock";
import { Request, Response } from "../../protocols";

import {
  FindLikeNameAndTeamIdPersonRepositorySpy,
  FindLikeNamePersonRepositorySpy,
} from "../../repositories/person-repository.mock";

import { ValidationSpy } from "../../validations/validation.mock";

import {
  FindPersonController,
  FindPersonRequest,
} from "./find-person-controller";

describe("FindPersonController", () => {
  let person: Person;
  let request: Request & FindPersonRequest;
  let validationSpy: ValidationSpy;
  let findLikeNamePersonRepositorySpy: FindLikeNamePersonRepositorySpy;
  let findLikeNameAndTeamIdPersonRepositorySpy: FindLikeNameAndTeamIdPersonRepositorySpy;
  let findPersonController: FindPersonController;

  beforeEach(() => {
    person = makePerson();
    request = { headers: {}, params: {}, query: {}, body: {} };

    validationSpy = new ValidationSpy();
    findLikeNamePersonRepositorySpy = new FindLikeNamePersonRepositorySpy();

    findLikeNameAndTeamIdPersonRepositorySpy =
      new FindLikeNameAndTeamIdPersonRepositorySpy();

    findPersonController = new FindPersonController(
      validationSpy,
      findLikeNamePersonRepositorySpy,
      findLikeNameAndTeamIdPersonRepositorySpy,
    );
  });

  it("should fail when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await findPersonController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should find people by name successfully", async () => {
    {
      const response = await findPersonController.handle(request);

      const expectedResponse: Response = {
        statusCode: 200,
        body: findLikeNamePersonRepositorySpy.result,
      };

      expect(response).toEqual(expectedResponse);
      expect(findLikeNamePersonRepositorySpy.name).toBe("");
    }

    {
      request.query.name = person.name;
      const response = await findPersonController.handle(request);

      const expectedResponse: Response = {
        statusCode: 200,
        body: findLikeNamePersonRepositorySpy.result,
      };

      expect(response).toEqual(expectedResponse);
      expect(findLikeNamePersonRepositorySpy.name).toBe(request.query.name);
    }
  });

  it("should find people by name and team id successfully", async () => {
    request.query.teamId = `${person.teamId}`;

    {
      const response = await findPersonController.handle(request);

      const expectedResponse: Response = {
        statusCode: 200,
        body: findLikeNameAndTeamIdPersonRepositorySpy.result,
      };

      expect(response).toEqual(expectedResponse);

      expect(findLikeNameAndTeamIdPersonRepositorySpy.name).toBe("");

      expect(findLikeNameAndTeamIdPersonRepositorySpy.teamId).toBe(
        +request.query.teamId,
      );
    }

    {
      request.query.name = person.name;

      const response = await findPersonController.handle(request);

      const expectedResponse: Response = {
        statusCode: 200,
        body: findLikeNameAndTeamIdPersonRepositorySpy.result,
      };

      expect(response).toEqual(expectedResponse);

      expect(findLikeNameAndTeamIdPersonRepositorySpy.name).toBe(
        request.query.name,
      );
      expect(findLikeNameAndTeamIdPersonRepositorySpy.teamId).toBe(
        +request.query.teamId,
      );
    }
  });
});
