import { makeInvoice, makeInvoiceProduct } from "../entities/invoice.mock";
import { makePerson } from "../entities/person.mock";
import { makeTeam } from "../entities/team.mock";

import {
  CreateInvoiceRepository,
  FindByPaidAtInvoiceRepository,
  FindByPersonIdAndPaidAtInvoiceRepository,
  FindByPersonIdInvoiceRepository,
  FindByTeamIdAndPaidAtInvoiceRepository,
  FindByTeamIdAndPersonIdAndPaidAtInvoiceRepository,
  FindByTeamIdAndPersonIdInvoiceRepository,
  FindByTeamIdInvoiceRepository,
  FindInvoiceRepository,
  FindOneByIdInvoiceRepository,
  InvoiceDto,
  UpdatePaidAtByIdInvoiceRepository,
} from "./invoice-repository";

export function makeInvoiceDto(): InvoiceDto {
  return {
    ...makeInvoice(),
    person: { ...makePerson(), team: makeTeam() },
    products: [
      makeInvoiceProduct(),
      makeInvoiceProduct(),
      makeInvoiceProduct(),
    ],
  };
}

export class FindInvoiceRepositorySpy implements FindInvoiceRepository {
  result: InvoiceDto[] = [makeInvoiceDto(), makeInvoiceDto(), makeInvoiceDto()];

  async find(): Promise<InvoiceDto[]> {
    return this.result;
  }
}

export class FindByTeamIdInvoiceRepositorySpy
  implements FindByTeamIdInvoiceRepository
{
  teamId?: number;
  result: InvoiceDto[] = [makeInvoiceDto(), makeInvoiceDto(), makeInvoiceDto()];

  async findByTeamId(teamId: number): Promise<InvoiceDto[]> {
    this.teamId = teamId;
    return this.result;
  }
}

export class FindByPersonIdInvoiceRepositorySpy
  implements FindByPersonIdInvoiceRepository
{
  personId?: number;
  result: InvoiceDto[] = [makeInvoiceDto(), makeInvoiceDto(), makeInvoiceDto()];

  async findByPersonId(personId: number): Promise<InvoiceDto[]> {
    this.personId = personId;
    return this.result;
  }
}

export class FindByPaidAtInvoiceRepositorySpy
  implements FindByPaidAtInvoiceRepository
{
  paidAt?: number | null | true;
  result: InvoiceDto[] = [makeInvoiceDto(), makeInvoiceDto(), makeInvoiceDto()];

  async findByPaidAt(paidAt: number | null | true): Promise<InvoiceDto[]> {
    this.paidAt = paidAt;
    return this.result;
  }
}

export class FindByTeamIdAndPersonIdInvoiceRepositorySpy
  implements FindByTeamIdAndPersonIdInvoiceRepository
{
  teamId?: number;
  personId?: number;
  result: InvoiceDto[] = [makeInvoiceDto(), makeInvoiceDto(), makeInvoiceDto()];

  async findByTeamIdAndPersonId(
    teamId: number,
    personId: number,
  ): Promise<InvoiceDto[]> {
    this.teamId = teamId;
    this.personId = personId;
    return this.result;
  }
}

export class FindByTeamIdAndPersonIdAndPaidAtInvoiceRepositorySpy
  implements FindByTeamIdAndPersonIdAndPaidAtInvoiceRepository
{
  params?: {
    teamId: number;
    personId: number;
    paidAt: number | null | true;
  };

  result: InvoiceDto[] = [makeInvoiceDto(), makeInvoiceDto(), makeInvoiceDto()];

  async findByTeamIdAndPersonIdAndPaidAt(params: {
    teamId: number;
    personId: number;
    paidAt: number | null | true;
  }): Promise<InvoiceDto[]> {
    this.params = params;
    return this.result;
  }
}

export class FindByTeamIdAndPaidAtInvoiceRepositorySpy
  implements FindByTeamIdAndPaidAtInvoiceRepository
{
  teamId?: number;
  paidAt?: number | null | true;
  result: InvoiceDto[] = [makeInvoiceDto(), makeInvoiceDto(), makeInvoiceDto()];

  async findByTeamIdAndPaidAt(
    teamId: number,
    paidAt: number | null | true,
  ): Promise<InvoiceDto[]> {
    this.teamId = teamId;
    this.paidAt = paidAt;
    return this.result;
  }
}

export class FindByPersonIdAndPaidAtInvoiceRepositorySpy
  implements FindByPersonIdAndPaidAtInvoiceRepository
{
  personId?: number;
  paidAt?: number | null | true;
  result: InvoiceDto[] = [makeInvoiceDto(), makeInvoiceDto(), makeInvoiceDto()];

  async findByPersonIdAndPaidAt(
    personId: number,
    paidAt: number | null | true,
  ): Promise<InvoiceDto[]> {
    this.personId = personId;
    this.paidAt = paidAt;
    return this.result;
  }
}

export class FindOneByIdInvoiceRepositorySpy
  implements FindOneByIdInvoiceRepository
{
  id?: number;
  result: InvoiceDto | null = makeInvoiceDto();

  async findOneById(id: number): Promise<InvoiceDto | null> {
    this.id = id;
    return this.result;
  }
}

export class CreateInvoiceRepositorySpy implements CreateInvoiceRepository {
  params?: {
    personId: number;
    createdAt: number;
    products: Array<{ name: string; value: number }>;
  };

  async create(params: {
    personId: number;
    createdAt: number;
    products: Array<{ name: string; value: number }>;
  }): Promise<void> {
    this.params = params;
  }
}

export class UpdatePaidAtByIdInvoiceRepositorySpy
  implements UpdatePaidAtByIdInvoiceRepository
{
  paidAt?: number | null;
  id?: number;

  async updatePaidAtById(paidAt: number | null, id: number): Promise<void> {
    this.paidAt = paidAt;
    this.id = id;
  }
}
