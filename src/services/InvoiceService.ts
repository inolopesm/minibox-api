import type { InvoiceRepository } from "../repositories/InvoiceRepository";
import type { Invoice } from "../entities/Invoice";
import type { InvoiceProduct } from "../entities/InvoiceProduct";
import type { PersonRepository } from "../repositories/PersonRepository";

type CreateParams = Omit<Invoice, "id" | "createdAt" | "paidAt"> & {
  products: Array<Omit<InvoiceProduct, "id" | "invoiceId">>;
};

export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly personRepository: PersonRepository,
  ) {}

  async find(): ReturnType<InvoiceRepository["find"]> {
    return await this.invoiceRepository.find();
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