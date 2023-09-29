import type { Invoice, InvoiceProduct, Person, Team } from "../entities";

export type InvoiceDTO = Invoice & {
  products: InvoiceProduct[];
  person: Person & { team: Team };
};

export interface FindInvoiceRepository {
  find: () => Promise<InvoiceDTO[]>;
}

export interface FindByTeamIdInvoiceRepository {
  findByTeamId: (teamId: number) => Promise<InvoiceDTO[]>;
}

export interface FindByPersonIdInvoiceRepository {
  findByPersonId: (personId: number) => Promise<InvoiceDTO[]>;
}

export interface FindByPaidAtInvoiceRepository {
  findByPaidAt: (paidAt: number | null | true) => Promise<InvoiceDTO[]>;
}

export interface FindByTeamIdAndPersonIdInvoiceRepository {
  findByTeamIdAndPersonId: (
    teamId: number,
    personId: number,
  ) => Promise<InvoiceDTO[]>;
}

export interface FindByTeamIdAndPersonIdAndPaidAtInvoiceRepository {
  findByTeamIdAndPersonIdAndPaidAt: ({
    teamId,
    personId,
    paidAt,
  }: {
    teamId: number;
    personId: number;
    paidAt: number | null | true;
  }) => Promise<InvoiceDTO[]>;
}

export interface FindByTeamIdAndPaidAtInvoiceRepository {
  findByTeamIdAndPaidAt: (
    teamId: number,
    paidAt: number | null | true,
  ) => Promise<InvoiceDTO[]>;
}

export interface FindByPersonIdAndPaidAtInvoiceRepository {
  findByPersonIdAndPaidAt: (
    personId: number,
    paidAt: number | null | true,
  ) => Promise<InvoiceDTO[]>;
}

export interface FindOneByIdInvoiceRepository {
  findOneById: (id: number) => Promise<InvoiceDTO | null>;
}

export interface CreateInvoiceRepository {
  create: ({
    personId,
    createdAt,
    products,
  }: {
    personId: number;
    createdAt: number;
    products: Array<{ name: string; value: number }>;
  }) => Promise<void>;
}

export interface UpdatePaidAtByIdInvoiceRepository {
  updatePaidAtById: (paidAt: number | null, id: number) => Promise<void>;
}
