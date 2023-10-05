import { Person } from "../../entities";
import { makePerson } from "../../entities/person.mock";
import { Request, Response } from "../../protocols";
import { FindOneByIdPersonRepositorySpy } from "../../repositories/person-repository.mock";
import { ValidationSpy } from "../../validations/validation.mock";

import {
  FindOnePersonController,
  FindOnePersonRequest,
} from "./find-one-person-controller";

describe("FindOnePersonController", () => {
  let person: Person;
  let request: Request & FindOnePersonRequest;
  let validationSpy: ValidationSpy;
  let findOneByIdPersonRepositorySpy: FindOneByIdPersonRepositorySpy;
  let findOnePersonController: FindOnePersonController;

  beforeEach(() => {
    person = makePerson();

    request = {
      headers: {},
      params: { personId: person.id.toString() },
      query: {},
      body: {},
    };

    validationSpy = new ValidationSpy();
    findOneByIdPersonRepositorySpy = new FindOneByIdPersonRepositorySpy();

    findOnePersonController = new FindOnePersonController(
      validationSpy,
      findOneByIdPersonRepositorySpy,
    );
  });

  it("should fail when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await findOnePersonController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should fail when person is not found", async () => {
    findOneByIdPersonRepositorySpy.result = null;

    const response = await findOnePersonController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: "Pessoa não encontrada" },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should find person successfully", async () => {
    const response = await findOnePersonController.handle(request);

    const expectedResponse: Response = {
      statusCode: 200,
      body: findOneByIdPersonRepositorySpy.result,
    };

    expect(response).toEqual(expectedResponse);
  });
});
