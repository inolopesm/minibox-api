import type { Invoice } from "../entities/Invoice";
import type { InvoiceProduct } from "../entities/InvoiceProduct";

import type {
  InvoiceDTO,
  InvoiceRepository,
} from "../repositories/InvoiceRepository";

import type { PersonRepository } from "../repositories/PersonRepository";

type CreateParams = Omit<Invoice, "id" | "createdAt" | "paidAt"> & {
  products: Array<Omit<InvoiceProduct, "id" | "invoiceId">>;
};

export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly personRepository: PersonRepository,
  ) {}

  async find({
    teamId,
    personId,
    paid,
  }: {
    teamId: number | undefined;
    personId: number | undefined;
    paid: boolean | undefined;
  }): Promise<InvoiceDTO[]> {
    const paidAt = paid === false ? null : paid;

    // prettier-ignore
    if (teamId !== undefined && personId !== undefined && paidAt !== undefined)
      return await this.invoiceRepository.findByTeamIdAndPersonIdAndPaidAt({ teamId, personId, paidAt })

    // prettier-ignore
    if (teamId !== undefined && personId !== undefined)
      return await this.invoiceRepository.findByTeamIdAndPersonId(teamId, personId)

    // prettier-ignore
    if (teamId !== undefined && paidAt !== undefined)
      return await this.invoiceRepository.findByTeamIdAndPaidAt(teamId, paidAt);

    if (teamId !== undefined)
      return await this.invoiceRepository.findByTeamId(teamId);

    // prettier-ignore
    if (personId !== undefined && paidAt !== undefined)
      return await this.invoiceRepository.findByPersonIdAndPaidAt(personId, paidAt);

    if (personId !== undefined)
      return await this.invoiceRepository.findByPersonId(personId);

    if (paidAt !== undefined)
      return await this.invoiceRepository.findByPaidAt(paidAt);

    return await this.invoiceRepository.find();
  }

  async findOne(id: number): Promise<InvoiceDTO | Error> {
    const invoice = await this.invoiceRepository.findOneById(id);

    if (invoice === null) {
      return new Error("Fatura não encontrada");
    }

    return invoice;
  }

  async create(params: CreateParams): Promise<Error | null> {
    const { personId, products } = params;

    const count = await this.personRepository.countById(personId);

    if (count === 0) {
      return new Error("Pessoa não encontrada");
    }

    const createdAt = Date.now();

    await this.invoiceRepository.create({ personId, createdAt, products });

    return null;
  }

  async pay(id: number): Promise<Error | null> {
    const invoice = await this.invoiceRepository.findOneById(id);

    if (invoice === null) {
      return new Error("Fatura não encontrada");
    }

    if (invoice.paidAt !== null) {
      return new Error("Fatura já marcada como paga");
    }

    await this.invoiceRepository.updatePaidAtById(Date.now(), id);

    return null;
  }
}
