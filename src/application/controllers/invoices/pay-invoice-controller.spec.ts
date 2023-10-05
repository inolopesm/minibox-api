import { Invoice } from "../../entities";
import { makeInvoice } from "../../entities/invoice.mock";
import { Request, Response } from "../../protocols";

import {
  FindOneByIdInvoiceRepositorySpy,
  UpdatePaidAtByIdInvoiceRepositorySpy,
} from "../../repositories/invoice-repository.mock";

import { ValidationSpy } from "../../validations/validation.mock";

import {
  PayInvoiceController,
  PayInvoiceRequest,
} from "./pay-invoice-controller";

describe("PayInvoiceController", () => {
  let invoice: Invoice;
  let request: Request & PayInvoiceRequest;
  let validationSpy: ValidationSpy;
  let findOneByIdInvoiceRepositorySpy: FindOneByIdInvoiceRepositorySpy;
  let updatePaidAtByIdInvoiceRepositorySpy: UpdatePaidAtByIdInvoiceRepositorySpy;
  let payInvoiceController: PayInvoiceController;

  beforeEach(() => {
    invoice = makeInvoice();

    request = {
      headers: {},
      params: { invoiceId: `${invoice.id}` },
      query: {},
      body: {},
    };

    validationSpy = new ValidationSpy();

    findOneByIdInvoiceRepositorySpy = new FindOneByIdInvoiceRepositorySpy();

    updatePaidAtByIdInvoiceRepositorySpy =
      new UpdatePaidAtByIdInvoiceRepositorySpy();

    payInvoiceController = new PayInvoiceController(
      validationSpy,
      findOneByIdInvoiceRepositorySpy,
      updatePaidAtByIdInvoiceRepositorySpy,
    );
  });

  it("should fail when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await payInvoiceController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should fail when invoice is not found", async () => {
    findOneByIdInvoiceRepositorySpy.result = null;

    const response = await payInvoiceController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: "Fatura não encontrada" },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should update invoice successfully", async () => {
    jest.useFakeTimers({ now: Date.now() });

    try {
      const response = await payInvoiceController.handle(request);

      const expectedResponse: Response = { statusCode: 200 };

      expect(response).toEqual(expectedResponse);

      expect(updatePaidAtByIdInvoiceRepositorySpy.paidAt).toBe(Date.now());

      expect(updatePaidAtByIdInvoiceRepositorySpy.id).toBe(
        +request.params.invoiceId,
      );
    } finally {
      jest.useRealTimers();
    }
  });
});
