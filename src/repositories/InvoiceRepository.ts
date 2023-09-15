import type { Invoice } from "../entities/Invoice";
import type { InvoiceProduct } from "../entities/InvoiceProduct";
import type { Person } from "../entities/Person";
import type { Team } from "../entities/Team";
import type { Knex } from "knex";

export type InvoiceDTO = Invoice & {
  products: InvoiceProduct[];
  person: Person & { team: Team };
};

type CreateParams = Omit<Invoice, "id" | "paidAt"> & {
  products: Array<Omit<InvoiceProduct, "id" | "invoiceId">>;
};

export class InvoiceRepository {
  constructor(private readonly knex: Knex) {}

  private get query(): Knex.QueryBuilder {
    // prettier-ignore
    return this.knex<Invoice>({ i: "Invoice" })
      .select("i.*")
      .select(this.knex.raw("JSON_AGG(ROW_TO_JSON(ip.*)) products"))
      .select(this.knex.raw("JSONB_INSERT(ROW_TO_JSON(p.*)::jsonb, '{team}', ROW_TO_JSON(t.*)::jsonb) person"))
      .join<InvoiceProduct>({ ip: "InvoiceProduct" }, "ip.invoiceId", "i.id")
      .join<Person>({ p: "Person" }, "p.id", "i.personId")
      .join<Team>({ t: "Team" }, "t.id", "p.teamId")
      .groupBy("i.id", "p.id", "t.id")
      .orderBy(["i.id", "p.id", "t.id"])
  }

  async find(): Promise<InvoiceDTO[]> {
    return await this.query;
  }

  async findByTeamId(teamId: number): Promise<InvoiceDTO[]> {
    return await this.query.where("p.teamId", teamId);
  }

  async findByPersonId(personId: number): Promise<InvoiceDTO[]> {
    return await this.query.where("i.personId", personId);
  }

  async findByPaidAt(paidAt: number | null | true): Promise<InvoiceDTO[]> {
    return paidAt === true
      ? await this.query.whereNotNull("i.paidAt")
      : await this.query.where("i.paidAt", paidAt);
  }

  async findByTeamIdAndPersonId(
    teamId: number,
    personId: number,
  ): Promise<InvoiceDTO[]> {
    return await this.query
      .where("p.teamId", teamId)
      .andWhere("i.personId", personId);
  }

  async findByTeamIdAndPersonIdAndPaidAt({
    teamId,
    personId,
    paidAt,
  }: {
    teamId: number;
    personId: number;
    paidAt: number | null | true;
  }): Promise<InvoiceDTO[]> {
    const query =
      paidAt === true
        ? this.query.whereNotNull("i.paidAt")
        : this.query.where("i.paidAt", paidAt);

    return await query
      .andWhere("p.teamId", teamId)
      .andWhere("i.personId", personId);
  }

  async findByTeamIdAndPaidAt(
    teamId: number,
    paidAt: number | null | true,
  ): Promise<InvoiceDTO[]> {
    const query =
      paidAt === true
        ? this.query.whereNotNull("i.paidAt")
        : this.query.where("i.paidAt", paidAt);

    return await query.andWhere("p.teamId", teamId);
  }

  async findByPersonIdAndPaidAt(
    personId: number,
    paidAt: number | null | true,
  ): Promise<InvoiceDTO[]> {
    const query =
      paidAt === true
        ? this.query.whereNotNull("i.paidAt")
        : this.query.where("i.paidAt", paidAt);

    return await query.andWhere("i.personId", personId);
  }

  async findOneById(id: number): Promise<InvoiceDTO | null> {
    const row = await this.query.where("i.id", id).first();
    return row ?? null;
  }

  async create(params: CreateParams): Promise<void> {
    const { products, ...invoiceData } = params;

    await this.knex.transaction(async (trx) => {
      const [invoice] = await trx<Invoice>("Invoice")
        .insert(invoiceData)
        .returning("id");

      if (invoice === undefined) {
        throw new Error("Invoice insert not returned id");
      }

      await trx<InvoiceProduct>("InvoiceProduct").insert(
        products.map((product) => ({ ...product, invoiceId: invoice.id })),
      );
    });
  }

  async updatePaidAtById(paidAt: number | null, id: number): Promise<void> {
    await this.knex<Invoice>("Invoice").update({ paidAt }).where({ id });
  }
}
