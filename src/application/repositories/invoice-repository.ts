import { Invoice, InvoiceProduct, Person, Team } from "../entities";

export type InvoiceDto = Invoice & {
  products: InvoiceProduct[];
  person: Person & { team: Team };
};

export interface FindInvoiceRepository {
  find(): Promise<InvoiceDto[]>;
}

export interface FindByTeamIdInvoiceRepository {
  findByTeamId(teamId: number): Promise<InvoiceDto[]>;
}

export interface FindByPersonIdInvoiceRepository {
  findByPersonId(personId: number): Promise<InvoiceDto[]>;
}

export interface FindByPaidAtInvoiceRepository {
  findByPaidAt(paidAt: number | null | true): Promise<InvoiceDto[]>;
}

export interface FindByTeamIdAndPersonIdInvoiceRepository {
  findByTeamIdAndPersonId(
    teamId: number,
    personId: number,
  ): Promise<InvoiceDto[]>;
}

export interface FindByTeamIdAndPersonIdAndPaidAtInvoiceRepository {
  findByTeamIdAndPersonIdAndPaidAt({
    teamId,
    personId,
    paidAt,
  }: {
    teamId: number;
    personId: number;
    paidAt: number | null | true;
  }): Promise<InvoiceDto[]>;
}

export interface FindByTeamIdAndPaidAtInvoiceRepository {
  findByTeamIdAndPaidAt(
    teamId: number,
    paidAt: number | null | true,
  ): Promise<InvoiceDto[]>;
}

export interface FindByPersonIdAndPaidAtInvoiceRepository {
  findByPersonIdAndPaidAt(
    personId: number,
    paidAt: number | null | true,
  ): Promise<InvoiceDto[]>;
}

export interface FindOneByIdInvoiceRepository {
  findOneById(id: number): Promise<InvoiceDto | null>;
}

export interface CreateInvoiceRepository {
  create({
    personId,
    createdAt,
    products,
  }: {
    personId: number;
    createdAt: number;
    products: Array<{ name: string; value: number }>;
  }): Promise<void>;
}

export interface UpdatePaidAtByIdInvoiceRepository {
  updatePaidAtById(paidAt: number | null, id: number): Promise<void>;
}
