import { Knex } from "knex";

export const up = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema.createTable("Product", (table) => {
    table.increments("id");
    table.string("name", 24).notNullable();
    table.integer("value").notNullable();
  });

export const down = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema.dropTable("Product");
