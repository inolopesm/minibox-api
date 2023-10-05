import { Invoice, Person } from "../../entities";
import { makeInvoice } from "../../entities/invoice.mock";
import { makePerson } from "../../entities/person.mock";
import { Request, Response } from "../../protocols";

import {
  FindByPaidAtInvoiceRepositorySpy,
  FindByPersonIdAndPaidAtInvoiceRepositorySpy,
  FindByPersonIdInvoiceRepositorySpy,
  FindByTeamIdAndPaidAtInvoiceRepositorySpy,
  FindByTeamIdAndPersonIdAndPaidAtInvoiceRepositorySpy,
  FindByTeamIdAndPersonIdInvoiceRepositorySpy,
  FindByTeamIdInvoiceRepositorySpy,
  FindInvoiceRepositorySpy,
} from "../../repositories/invoice-repository.mock";

import { ValidationSpy } from "../../validations/validation.mock";

import {
  FindInvoiceController,
  FindInvoiceRequest,
} from "./find-invoice-controller";

describe("FindInvoiceController", () => {
  let invoice: Invoice;
  let person: Person;
  let request: Request & FindInvoiceRequest;
  let validationSpy: ValidationSpy;
  let findByTeamIdAndPersonIdAndPaidAtInvoiceRepositorySpy: FindByTeamIdAndPersonIdAndPaidAtInvoiceRepositorySpy;
  let findByTeamIdAndPersonIdInvoiceRepositorySpy: FindByTeamIdAndPersonIdInvoiceRepositorySpy;
  let findByTeamIdAndPaidAtInvoiceRepositorySpy: FindByTeamIdAndPaidAtInvoiceRepositorySpy;
  let findByTeamIdInvoiceRepositorySpy: FindByTeamIdInvoiceRepositorySpy;
  let findByPersonIdAndPaidAtInvoiceRepositorySpy: FindByPersonIdAndPaidAtInvoiceRepositorySpy;
  let findByPersonIdInvoiceRepositorySpy: FindByPersonIdInvoiceRepositorySpy;
  let findByPaidAtInvoiceRepositorySpy: FindByPaidAtInvoiceRepositorySpy;
  let findInvoiceRepositorySpy: FindInvoiceRepositorySpy;
  let findInvoiceController: FindInvoiceController;

  beforeEach(() => {
    invoice = makeInvoice();
    person = makePerson();

    request = { headers: {}, params: {}, query: {}, body: {} };

    validationSpy = new ValidationSpy();

    findByTeamIdAndPersonIdAndPaidAtInvoiceRepositorySpy =
      new FindByTeamIdAndPersonIdAndPaidAtInvoiceRepositorySpy();

    findByTeamIdAndPersonIdInvoiceRepositorySpy =
      new FindByTeamIdAndPersonIdInvoiceRepositorySpy();

    findByTeamIdAndPaidAtInvoiceRepositorySpy =
      new FindByTeamIdAndPaidAtInvoiceRepositorySpy();

    findByTeamIdInvoiceRepositorySpy = new FindByTeamIdInvoiceRepositorySpy();

    findByPersonIdAndPaidAtInvoiceRepositorySpy =
      new FindByPersonIdAndPaidAtInvoiceRepositorySpy();

    findByPersonIdInvoiceRepositorySpy =
      new FindByPersonIdInvoiceRepositorySpy();

    findByPaidAtInvoiceRepositorySpy = new FindByPaidAtInvoiceRepositorySpy();
    findInvoiceRepositorySpy = new FindInvoiceRepositorySpy();

    findInvoiceController = new FindInvoiceController(
      validationSpy,
      findByTeamIdAndPersonIdAndPaidAtInvoiceRepositorySpy,
      findByTeamIdAndPersonIdInvoiceRepositorySpy,
      findByTeamIdAndPaidAtInvoiceRepositorySpy,
      findByTeamIdInvoiceRepositorySpy,
      findByPersonIdAndPaidAtInvoiceRepositorySpy,
      findByPersonIdInvoiceRepositorySpy,
      findByPaidAtInvoiceRepositorySpy,
      findInvoiceRepositorySpy,
    );
  });

  it("should fail when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await findInvoiceController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should find people by team id successfully", async () => {
    request.query.teamId = `${person.teamId}`;

    const response = await findInvoiceController.handle(request);

    const expectedResponse: Response = {
      statusCode: 200,
      body: findByTeamIdInvoiceRepositorySpy.result,
    };

    expect(response).toEqual(expectedResponse);

    expect(findByTeamIdInvoiceRepositorySpy.teamId).toEqual(
      +request.query.teamId,
    );
  });

  it("should find people by person id successfully", async () => {
    request.query.personId = `${invoice.personId}`;

    const response = await findInvoiceController.handle(request);

    const expectedResponse: Response = {
      statusCode: 200,
      body: findByPersonIdInvoiceRepositorySpy.result,
    };

    expect(response).toEqual(expectedResponse);

    expect(findByPersonIdInvoiceRepositorySpy.personId).toEqual(
      +request.query.personId,
    );
  });

  it("should find people by paid successfully", async () => {
    for (const value of ["true", "false"] as const) {
      request.query.paid = value;

      const paidAt = value === "false" ? null : true;

      const response = await findInvoiceController.handle(request);

      const expectedResponse: Response = {
        statusCode: 200,
        body: findByPaidAtInvoiceRepositorySpy.result,
      };

      expect(response).toEqual(expectedResponse);
      expect(findByPaidAtInvoiceRepositorySpy.paidAt).toEqual(paidAt);
    }
  });

  it("should find people by team id and person id successfully", async () => {
    request.query.teamId = `${person.teamId}`;
    request.query.personId = `${invoice.personId}`;

    const response = await findInvoiceController.handle(request);

    const expectedResponse: Response = {
      statusCode: 200,
      body: findByTeamIdAndPersonIdInvoiceRepositorySpy.result,
    };

    expect(response).toEqual(expectedResponse);

    expect(findByTeamIdAndPersonIdInvoiceRepositorySpy.teamId).toEqual(
      +request.query.teamId,
    );

    expect(findByTeamIdAndPersonIdInvoiceRepositorySpy.personId).toEqual(
      +request.query.personId,
    );
  });

  it("should find people by team id and paid successfully", async () => {
    for (const value of ["true", "false"] as const) {
      request.query.teamId = `${person.teamId}`;
      request.query.paid = value;

      const paidAt = value === "false" ? null : true;

      const response = await findInvoiceController.handle(request);

      const expectedResponse: Response = {
        statusCode: 200,
        body: findByTeamIdAndPaidAtInvoiceRepositorySpy.result,
      };

      expect(response).toEqual(expectedResponse);

      expect(findByTeamIdAndPaidAtInvoiceRepositorySpy.teamId).toEqual(
        +request.query.teamId,
      );

      expect(findByTeamIdAndPaidAtInvoiceRepositorySpy.paidAt).toEqual(paidAt);
    }
  });

  it("should find people by person id and paid successfully", async () => {
    for (const value of ["true", "false"] as const) {
      request.query.personId = `${invoice.personId}`;
      request.query.paid = value;

      const paidAt = value === "false" ? null : true;

      const response = await findInvoiceController.handle(request);

      const expectedResponse: Response = {
        statusCode: 200,
        body: findByPersonIdAndPaidAtInvoiceRepositorySpy.result,
      };

      expect(response).toEqual(expectedResponse);

      expect(findByPersonIdAndPaidAtInvoiceRepositorySpy.personId).toEqual(
        +request.query.personId,
      );

      expect(findByPersonIdAndPaidAtInvoiceRepositorySpy.paidAt).toEqual(
        paidAt,
      );
    }
  });

  it("should find people by team id, person id and paid successfully", async () => {
    for (const value of ["true", "false"] as const) {
      request.query.teamId = `${person.teamId}`;
      request.query.personId = `${invoice.personId}`;
      request.query.paid = value;

      const paidAt = value === "false" ? null : true;

      const response = await findInvoiceController.handle(request);

      const expectedResponse: Response = {
        statusCode: 200,
        body: findByTeamIdAndPersonIdAndPaidAtInvoiceRepositorySpy.result,
      };

      const expectedParams: NonNullable<
        FindByTeamIdAndPersonIdAndPaidAtInvoiceRepositorySpy["params"]
      > = {
        teamId: +request.query.teamId,
        personId: +request.query.personId,
        paidAt,
      };

      expect(response).toEqual(expectedResponse);

      expect(
        findByTeamIdAndPersonIdAndPaidAtInvoiceRepositorySpy.params,
      ).toEqual(expectedParams);
    }
  });

  it("should find people successfully", async () => {
    const response = await findInvoiceController.handle(request);

    const expectedResponse: Response = {
      statusCode: 200,
      body: findInvoiceRepositorySpy.result,
    };

    expect(response).toEqual(expectedResponse);
  });
});
