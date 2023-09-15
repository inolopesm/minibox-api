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

  async find(
    teamId: number | undefined,
    personId: number | undefined,
  ): Promise<InvoiceDTO[]> {
    return teamId !== undefined
      ? personId !== undefined
        ? await this.invoiceRepository.findByTeamIdAndPersonId(teamId, personId)
        : await this.invoiceRepository.findByTeamId(teamId)
      : personId !== undefined
      ? await this.invoiceRepository.findByPersonId(personId)
      : await this.invoiceRepository.find();
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
}
