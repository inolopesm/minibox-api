import { Invoice } from "../../entities";
import { makeInvoice } from "../../entities/invoice.mock";
import { Request, Response } from "../../protocols";
import { FindOneByIdInvoiceRepositorySpy } from "../../repositories/invoice-repository.mock";
import { ValidationSpy } from "../../validations/validation.mock";

import {
  FindOneInvoiceController,
  FindOneInvoiceRequest,
} from "./find-one-invoice-controller";

describe("FindOneInvoiceController", () => {
  let invoice: Invoice;
  let request: Request & FindOneInvoiceRequest;
  let validationSpy: ValidationSpy;
  let findOneByIdInvoiceRepositorySpy: FindOneByIdInvoiceRepositorySpy;
  let findOneInvoiceController: FindOneInvoiceController;

  beforeEach(() => {
    invoice = makeInvoice();

    request = {
      headers: {},
      params: { invoiceId: invoice.id.toString() },
      query: {},
      body: {},
    };

    validationSpy = new ValidationSpy();
    findOneByIdInvoiceRepositorySpy = new FindOneByIdInvoiceRepositorySpy();

    findOneInvoiceController = new FindOneInvoiceController(
      validationSpy,
      findOneByIdInvoiceRepositorySpy,
    );
  });

  it("should fail when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await findOneInvoiceController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should fail when invoice is not found", async () => {
    findOneByIdInvoiceRepositorySpy.result = null;

    const response = await findOneInvoiceController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: "Fatura não encontrada" },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should find invoice successfully", async () => {
    const response = await findOneInvoiceController.handle(request);

    const expectedResponse: Response = {
      statusCode: 200,
      body: findOneByIdInvoiceRepositorySpy.result,
    };

    expect(response).toEqual(expectedResponse);
  });
});
