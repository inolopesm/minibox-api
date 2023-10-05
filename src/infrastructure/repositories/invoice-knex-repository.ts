import { Knex } from "knex";
import { Invoice, InvoiceProduct } from "../../application/entities";

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
} from "../../application/repositories";

import { KnexHelper } from "../helpers";

export class InvoiceKnexRepository
  implements
    FindInvoiceRepository,
    FindByTeamIdInvoiceRepository,
    FindByPersonIdInvoiceRepository,
    FindByPaidAtInvoiceRepository,
    FindByTeamIdAndPersonIdInvoiceRepository,
    FindByTeamIdAndPersonIdAndPaidAtInvoiceRepository,
    FindByTeamIdAndPaidAtInvoiceRepository,
    FindByPersonIdAndPaidAtInvoiceRepository,
    FindOneByIdInvoiceRepository,
    CreateInvoiceRepository,
    UpdatePaidAtByIdInvoiceRepository
{
  private readonly knex = KnexHelper.getInstance().getClient();

  private get query(): Knex.QueryBuilder {
    // prettier-ignore
    return this.knex({ i: "Invoice" })
      .select("i.*")
      .select(this.knex.raw("JSON_AGG(ROW_TO_JSON(ip.*)) products"))
      .select(this.knex.raw("JSONB_INSERT(ROW_TO_JSON(p.*)::jsonb, '{team}', ROW_TO_JSON(t.*)::jsonb) person"))
      .join({ ip: "InvoiceProduct" }, "ip.invoiceId", "i.id")
      .join({ p: "Person" }, "p.id", "i.personId")
      .join({ t: "Team" }, "t.id", "p.teamId")
      .groupBy("i.id", "p.id", "t.id")
      .orderBy(["i.id", "p.id", "t.id"])
  }

  async find(): Promise<InvoiceDto[]> {
    return await this.query;
  }

  async findByTeamId(teamId: number): Promise<InvoiceDto[]> {
    return await this.query.where("p.teamId", teamId);
  }

  async findByPersonId(personId: number): Promise<InvoiceDto[]> {
    return await this.query.where("i.personId", personId);
  }

  async findByPaidAt(paidAt: number | null | true): Promise<InvoiceDto[]> {
    return paidAt === true
      ? await this.query.whereNotNull("i.paidAt")
      : await this.query.where("i.paidAt", paidAt);
  }

  async findByTeamIdAndPersonId(
    teamId: number,
    personId: number,
  ): Promise<InvoiceDto[]> {
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
  }): Promise<InvoiceDto[]> {
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
  ): Promise<InvoiceDto[]> {
    const query =
      paidAt === true
        ? this.query.whereNotNull("i.paidAt")
        : this.query.where("i.paidAt", paidAt);

    return await query.andWhere("p.teamId", teamId);
  }

  async findByPersonIdAndPaidAt(
    personId: number,
    paidAt: number | null | true,
  ): Promise<InvoiceDto[]> {
    const query =
      paidAt === true
        ? this.query.whereNotNull("i.paidAt")
        : this.query.where("i.paidAt", paidAt);

    return await query.andWhere("i.personId", personId);
  }

  async findOneById(id: number): Promise<InvoiceDto | null> {
    const row = await this.query.where("i.id", id).first();
    return row ?? null;
  }

  async create({
    personId,
    createdAt,
    products,
  }: {
    personId: number;
    createdAt: number;
    products: Array<{ name: string; value: number }>;
  }): Promise<void> {
    await this.knex.transaction(async (trx) => {
      const [invoice] = await trx<Invoice>("Invoice")
        .insert({ personId, createdAt })
        .returning("id");

      if (invoice === undefined) {
        throw new Error("Invoice insert not returned id");
      }

      await trx<InvoiceProduct>("InvoiceProduct").insert(
        products.map(({ name, value }) => ({
          name,
          value,
          invoiceId: invoice.id,
        })),
      );
    });
  }

  async updatePaidAtById(paidAt: number | null, id: number): Promise<void> {
    await this.knex<Invoice>("Invoice").update({ paidAt }).where({ id });
  }
}
