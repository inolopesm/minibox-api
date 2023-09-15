import type { Invoice } from "../entities/Invoice";
import type { InvoiceProduct } from "../entities/InvoiceProduct";
import type { Person } from "../entities/Person";
import type { Team } from "../entities/Team";
import type { Knex } from "knex";

type InvoiceDTO = Invoice & {
  products: InvoiceProduct[];
  person: Person & { team: Team };
};

type CreateParams = Omit<Invoice, "id" | "paidAt"> & {
  products: Array<Omit<InvoiceProduct, "id" | "invoiceId">>;
};

export class InvoiceRepository {
  constructor(private readonly knex: Knex) {}

  async find(): Promise<InvoiceDTO[]> {
    // prettier-ignore
    return await this.knex<Invoice>({ i: "Invoice" })
      .select("i.*")
      .select(this.knex.raw("JSON_AGG(ROW_TO_JSON(ip.*)) products"))
      .select(this.knex.raw("JSONB_INSERT(ROW_TO_JSON(p.*)::jsonb, '{team}', ROW_TO_JSON(t.*)::jsonb) person"))
      .join<InvoiceProduct>({ ip: "InvoiceProduct" }, "ip.invoiceId", "i.id")
      .join<Person>({ p: "Person" }, "p.id", "i.personId")
      .join<Team>({ t: "Team" }, "t.id", "p.teamId")
      .groupBy("i.id", "p.id", "t.id")
      .orderBy(["i.id", "p.id", "t.id"])
  }

  async findByTeamId(teamId: number): Promise<InvoiceDTO[]> {
    // prettier-ignore
    return await this.knex<Invoice>({ i: "Invoice" })
      .select("i.*")
      .select(this.knex.raw("JSON_AGG(ROW_TO_JSON(ip.*)) products"))
      .select(this.knex.raw("JSONB_INSERT(ROW_TO_JSON(p.*)::jsonb, '{team}', ROW_TO_JSON(t.*)::jsonb) person"))
      .join<InvoiceProduct>({ ip: "InvoiceProduct" }, "ip.invoiceId", "i.id")
      .join<Person>({ p: "Person" }, "p.id", "i.personId")
      .join<Team>({ t: "Team" }, "t.id", "p.teamId")
      .where("p.teamId", teamId)
      .groupBy("i.id", "p.id", "t.id")
      .orderBy(["i.id", "p.id", "t.id"]);
  }

  async findByPersonId(personId: number): Promise<InvoiceDTO[]> {
    // prettier-ignore
    return await this.knex<Invoice>({ i: "Invoice" })
      .select("i.*")
      .select(this.knex.raw("JSON_AGG(ROW_TO_JSON(ip.*)) products"))
      .select(this.knex.raw("JSONB_INSERT(ROW_TO_JSON(p.*)::jsonb, '{team}', ROW_TO_JSON(t.*)::jsonb) person"))
      .join<InvoiceProduct>({ ip: "InvoiceProduct" }, "ip.invoiceId", "i.id")
      .join<Person>({ p: "Person" }, "p.id", "i.personId")
      .join<Team>({ t: "Team" }, "t.id", "p.teamId")
      .where("i.personId", personId)
      .groupBy("i.id", "p.id", "t.id")
      .orderBy(["i.id", "p.id", "t.id"]);
  }

  async findByTeamIdAndPersonId(
    teamId: number,
    personId: number,
  ): Promise<InvoiceDTO[]> {
    // prettier-ignore
    return await this.knex<Invoice>({ i: "Invoice" })
      .select("i.*")
      .select(this.knex.raw("JSON_AGG(ROW_TO_JSON(ip.*)) products"))
      .select(this.knex.raw("JSONB_INSERT(ROW_TO_JSON(p.*)::jsonb, '{team}', ROW_TO_JSON(t.*)::jsonb) person"))
      .join<InvoiceProduct>({ ip: "InvoiceProduct" }, "ip.invoiceId", "i.id")
      .join<Person>({ p: "Person" }, "p.id", "i.personId")
      .join<Team>({ t: "Team" }, "t.id", "p.teamId")
      .where("p.teamId", teamId)
      .andWhere("i.personId", personId)
      .groupBy("i.id", "p.id", "t.id")
      .orderBy(["i.id", "p.id", "t.id"]);
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
}
