import { Invoice, InvoiceProduct } from "../../entities";
import { makeInvoice, makeInvoiceProduct } from "../../entities/invoice.mock";
import { Request, Response } from "../../protocols";
import { CreateInvoiceRepositorySpy } from "../../repositories/invoice-repository.mock";
import { FindOneByIdPersonRepositorySpy } from "../../repositories/person-repository.mock";
import { ValidationSpy } from "../../validations/validation.mock";

import {
  CreateInvoiceController,
  CreateInvoiceRequest,
} from "./create-invoice-controller";

describe("CreateInvoiceController", () => {
  let invoice: Invoice;
  let invoiceProducts: InvoiceProduct[];
  let request: Request & CreateInvoiceRequest;
  let validationSpy: ValidationSpy;
  let findOneByIdPersonRepositorySpy: FindOneByIdPersonRepositorySpy;
  let createInvoiceRepositorySpy: CreateInvoiceRepositorySpy;
  let createInvoiceController: CreateInvoiceController;

  beforeEach(() => {
    invoice = makeInvoice();

    invoiceProducts = [
      makeInvoiceProduct(),
      makeInvoiceProduct(),
      makeInvoiceProduct(),
    ];

    request = {
      headers: {},
      params: {},
      query: {},
      body: {
        personId: invoice.personId,
        products: invoiceProducts.map((invoiceProduct) => ({
          name: invoiceProduct.name,
          value: invoiceProduct.value,
        })),
      },
    };

    validationSpy = new ValidationSpy();
    findOneByIdPersonRepositorySpy = new FindOneByIdPersonRepositorySpy();
    createInvoiceRepositorySpy = new CreateInvoiceRepositorySpy();

    createInvoiceController = new CreateInvoiceController(
      validationSpy,
      findOneByIdPersonRepositorySpy,
      createInvoiceRepositorySpy,
    );
  });

  it("should fail when validation fails", async () => {
    const error = new Error("validation failed");
    validationSpy.result = error;

    const response = await createInvoiceController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: error.message },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should fail when person is not found", async () => {
    findOneByIdPersonRepositorySpy.result = null;

    const response = await createInvoiceController.handle(request);

    const expectedResponse: Response = {
      statusCode: 400,
      body: { message: "Pessoa não encontrada" },
    };

    expect(response).toEqual(expectedResponse);
  });

  it("should create invoice successfully", async () => {
    jest.useFakeTimers({ now: Date.now() });

    try {
      const response = await createInvoiceController.handle(request);

      const expectedResponse: Response = { statusCode: 200 };

      const expectedParams: NonNullable<CreateInvoiceRepositorySpy["params"]> =
        {
          personId: request.body.personId,
          products: request.body.products,
          createdAt: Date.now(),
        };

      expect(response).toEqual(expectedResponse);
      expect(createInvoiceRepositorySpy.params).toEqual(expectedParams);
    } finally {
      jest.useRealTimers();
    }
  });
});
