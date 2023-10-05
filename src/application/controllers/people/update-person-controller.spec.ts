import { Person } from "../../entities";
import { makePerson } from "../../entities/person.mock";
import { Request, Response } from "../../protocols";
import { UpdateNameAndTeamIdByIdPersonRepositorySpy } from "../../repositories/person-repository.mock";
import { FindOneByIdTeamRepositorySpy } from "../../repositories/team-repository.mock";
import { ValidationSpy } from "../../validations/validation.mock";

import {
  UpdatePersonController,
  UpdatePersonRequest,
} from "./update-person-controller";

describe("UpdatePersonController", () => {
  let person: Person;
  let request: Request & UpdatePersonRequest;
  let validationSpy: ValidationSpy;
  let findOneByIdTeamRepositorySpy: FindOneByIdTeamRepositorySpy;
  let updateNameAndTeamIdByIdPersonRepositorySpy: UpdateNameAndTeamIdByIdPersonRepositorySpy;
  let updatePersonController: UpdatePersonController;

  beforeEach(() => {
    person = makePerson();

    request = {
      headers: {},
      params: { personId: person.id.toString() },
      query: {},
      body: { name: person.name, teamId: person.teamId },
    };

    validationSpy = new ValidationSpy();

    findOneByIdTeamRepositorySpy = new FindOneByIdTeamRepositorySpy();

    updateNameAndTeamIdByIdPersonRepositorySpy =
      new UpdateNameAndTeamIdByIdPersonRepositorySpy();

    updatePersonController = new UpdatePersonController(
      validationSpy,
      findOneByIdTeamRepositorySpy,
      updateNameAndTeamIdByIdPersonRepositorySpy,
    );
  });

  it("should fail when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await updatePersonController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should fail when team is not found", async () => {
    findOneByIdTeamRepositorySpy.result = null;

    const response = await updatePersonController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: "Equipe não encontrada" },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should update person successfully", async () => {
    const response = await updatePersonController.handle(request);

    const expectedResponse: Response = { statusCode: 200 };

    const expectedParams: NonNullable<
      UpdateNameAndTeamIdByIdPersonRepositorySpy["params"]
    > = {
      id: +request.params.personId,
      name: request.body.name,
      teamId: request.body.teamId,
    };

    expect(response).toEqual(expectedResponse);

    expect(updateNameAndTeamIdByIdPersonRepositorySpy.params).toEqual(
      expectedParams,
    );
  });
});
