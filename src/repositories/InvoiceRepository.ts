import type { Invoice } from "../entities/Invoice";
import type { InvoiceProduct } from "../entities/InvoiceProduct";
import type { Person } from "../entities/Person";
import type { Team } from "../entities/Team";
import type { Knex } from "knex";

interface FindInvoiceDTO {
  id: Invoice["id"];
  personId: Invoice["personId"];
  createdAt: Invoice["createdAt"];
  paidAt: Invoice["paidAt"];

  person: {
    id: Person["id"];
    name: Person["name"];
    teamId: Person["teamId"];

    team: {
      id: Team["id"];
      name: Team["name"];
    };
  };

  products: Array<{
    id: InvoiceProduct["id"];
    name: InvoiceProduct["name"];
    value: InvoiceProduct["value"];
  }>;
}

interface CreateParams {
  personId: Invoice["personId"];
  createdAt: Invoice["createdAt"];
  paidAt?: Invoice["paidAt"];

  products: Array<{
    name: InvoiceProduct["name"];
    value: InvoiceProduct["value"];
  }>;
}

export class InvoiceRepository {
  constructor(private readonly knex: Knex) {}

  async find(): Promise<FindInvoiceDTO[]> {
    const { rows } = await this.knex.raw(`
      SELECT
        i.id, i."personId", i."createdAt", i."paidAt",

        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', ip.id,
            'name', ip.name,
            'value', ip.value
          )
        ) products,

        JSON_BUILD_OBJECT(
          'id', p.id,
          'name', p.name,
          'teamId', p."teamId",
          'team', json_build_object(
            'id', t.id,
            'name', t.name
          )
        ) person
      FROM "Invoice" i
      JOIN "InvoiceProduct" ip ON ip."invoiceId" = i.id
      JOIN "Person" p ON p.id = i."personId"
      JOIN "Team" t ON t.id = p."teamId"
      GROUP BY i.id, p.id, t.id
      ORDER BY i.id, p.id, t.id
    `);

    return rows;
  }

  async findByTeamId(teamId: number): Promise<FindInvoiceDTO[]> {
    const { rows } = await this.knex.raw(
      `
      SELECT
        i.id, i."personId", i."createdAt", i."paidAt",

        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', ip.id,
            'name', ip.name,
            'value', ip.value
          )
        ) products,

        JSON_BUILD_OBJECT(
          'id', p.id,
          'name', p.name,
          'teamId', p."teamId",
          'team', json_build_object(
            'id', t.id,
            'name', t.name
          )
        ) person
      FROM "Invoice" i
      JOIN "InvoiceProduct" ip ON ip."invoiceId" = i.id
      JOIN "Person" p ON p.id = i."personId"
      JOIN "Team" t ON t.id = p."teamId"
      WHERE  p."teamId" = ?
      GROUP BY i.id, p.id, t.id
      ORDER BY i.id, p.id, t.id
    `,
      [teamId],
    );

    return rows;
  }

  async findByPersonId(personId: number): Promise<FindInvoiceDTO[]> {
    const { rows } = await this.knex.raw(
      `
      SELECT
        i.id, i."personId", i."createdAt", i."paidAt",

        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', ip.id,
            'name', ip.name,
            'value', ip.value
          )
        ) products,

        JSON_BUILD_OBJECT(
          'id', p.id,
          'name', p.name,
          'teamId', p."teamId",
          'team', json_build_object(
            'id', t.id,
            'name', t.name
          )
        ) person
      FROM "Invoice" i
      JOIN "InvoiceProduct" ip ON ip."invoiceId" = i.id
      JOIN "Person" p ON p.id = i."personId"
      JOIN "Team" t ON t.id = p."teamId"
      WHERE i."personId" = ?
      GROUP BY i.id, p.id, t.id
      ORDER BY i.id, p.id, t.id
    `,
      [personId],
    );

    return rows;
  }

  async findByTeamIdAndPersonId(
    teamId: number,
    personId: number,
  ): Promise<FindInvoiceDTO[]> {
    const { rows } = await this.knex.raw(
      `
      SELECT
        i.id, i."personId", i."createdAt", i."paidAt",

        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', ip.id,
            'name', ip.name,
            'value', ip.value
          )
        ) products,

        JSON_BUILD_OBJECT(
          'id', p.id,
          'name', p.name,
          'teamId', p."teamId",
          'team', json_build_object(
            'id', t.id,
            'name', t.name
          )
        ) person
      FROM "Invoice" i
      JOIN "InvoiceProduct" ip ON ip."invoiceId" = i.id
      JOIN "Person" p ON p.id = i."personId"
      JOIN "Team" t ON t.id = p."teamId"
      WHERE p."teamId" = ? AND i."personId" = ?
      GROUP BY i.id, p.id, t.id
      ORDER BY i.id, p.id, t.id
    `,
      [teamId, personId],
    );

    return rows;
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
