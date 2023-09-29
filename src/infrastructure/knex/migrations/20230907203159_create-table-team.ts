import type { Knex } from "knex";

export const up = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema.createTable("Team", (table) => {
    table.increments("id");
    table.string("name", 24).notNullable().unique();
  });

export const down = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema.dropTable("Team");
