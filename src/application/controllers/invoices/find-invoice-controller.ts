import type {
  Controller,
  Request,
  Response,
  Validation,
} from "../../protocols";

import type {
  FindByTeamIdAndPersonIdAndPaidAtInvoiceRepository,
  FindByTeamIdAndPersonIdInvoiceRepository,
  FindByTeamIdAndPaidAtInvoiceRepository,
  FindByTeamIdInvoiceRepository,
  FindByPersonIdAndPaidAtInvoiceRepository,
  FindByPersonIdInvoiceRepository,
  FindByPaidAtInvoiceRepository,
  FindInvoiceRepository,
  InvoiceDTO,
} from "../../repositories";

export interface FindInvoiceRequest {
  query: {
    teamId?: `${number}`;
    personId?: `${number}`;
    paid?: "true" | "false";
  };
}

export class FindInvoiceController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly findByTeamIdAndPersonIdAndPaidAtInvoiceRepository: FindByTeamIdAndPersonIdAndPaidAtInvoiceRepository,
    private readonly findByTeamIdAndPersonIdInvoiceRepository: FindByTeamIdAndPersonIdInvoiceRepository,
    private readonly findByTeamIdAndPaidAtInvoiceRepository: FindByTeamIdAndPaidAtInvoiceRepository,
    private readonly findByTeamIdInvoiceRepository: FindByTeamIdInvoiceRepository,
    private readonly findByPersonIdAndPaidAtInvoiceRepository: FindByPersonIdAndPaidAtInvoiceRepository,
    private readonly findByPersonIdInvoiceRepository: FindByPersonIdInvoiceRepository,
    private readonly findByPaidAtInvoiceRepository: FindByPaidAtInvoiceRepository,
    private readonly findInvoiceRepository: FindInvoiceRepository,
  ) {}

  async handle(request: Request): Promise<Response> {
    const error = this.validation.validate(request);

    if (error !== null) {
      return { statusCode: 400, body: { message: error.message } };
    }

    const query = request.query as FindInvoiceRequest["query"];

    const teamId = query.teamId !== undefined ? +query.teamId : undefined;
    const personId = query.personId !== undefined ? +query.personId : undefined;
    const paid = query.paid !== undefined ? query.paid === "true" : undefined;

    const paidAt = paid === false ? null : paid;

    let invoices: InvoiceDTO[];

    // prettier-ignore
    if (teamId !== undefined && personId !== undefined && paidAt !== undefined)
      invoices = await this.findByTeamIdAndPersonIdAndPaidAtInvoiceRepository.findByTeamIdAndPersonIdAndPaidAt({ teamId, personId, paidAt })
    else if (teamId !== undefined && personId !== undefined)
      invoices = await this.findByTeamIdAndPersonIdInvoiceRepository.findByTeamIdAndPersonId(teamId, personId)
    else if (teamId !== undefined && paidAt !== undefined)
      invoices = await this.findByTeamIdAndPaidAtInvoiceRepository.findByTeamIdAndPaidAt(teamId, paidAt);
    else if (teamId !== undefined)
      invoices = await this.findByTeamIdInvoiceRepository.findByTeamId(teamId);
    else if (personId !== undefined && paidAt !== undefined)
      invoices = await this.findByPersonIdAndPaidAtInvoiceRepository.findByPersonIdAndPaidAt(personId, paidAt);
    else if (personId !== undefined)
      invoices = await this.findByPersonIdInvoiceRepository.findByPersonId(personId);
    else if (paidAt !== undefined)
      invoices = await this.findByPaidAtInvoiceRepository.findByPaidAt(paidAt);
    else
      invoices = await this.findInvoiceRepository.find();

    return { statusCode: 200, body: invoices };
  }
}
