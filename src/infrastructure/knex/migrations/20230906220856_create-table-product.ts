import type { Knex } from "knex";

export const up = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema.createTable("Product", (table) => {
    table.increments("id");
    table.string("name", 24).notNullable().unique();
    table.integer("value").notNullable();
  });

export const down = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema.dropTable("Product");
