import type { Knex } from "knex";

export const up = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema.createTable("Invoice", (table) => {
    table.increments("id");
    table.integer("personId").notNullable();
    table.bigInteger("createdAt").notNullable();
    table.bigInteger("paidAt");
    table.foreign("personId").references("id").inTable("Person");
  });

export const down = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema.dropTable("Invoice");
