import type { Knex } from "knex";

export const up = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema.createTable("InvoiceProduct", (table) => {
    table.increments("id");
    table.integer("invoiceId").notNullable();
    table.string("name", 24).notNullable();
    table.integer("value").notNullable();
    table.foreign("invoiceId").references("id").inTable("Invoice");
  });

export const down = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema.dropTable("InvoiceProduct");
