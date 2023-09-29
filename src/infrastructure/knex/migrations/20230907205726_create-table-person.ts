import type { Knex } from "knex";

export const up = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema.createTable("Person", (table) => {
    table.increments("id");
    table.integer("teamId").notNullable();
    table.string("name", 24).notNullable().unique();
    table.foreign("teamId").references("id").inTable("Team");
  });

export const down = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema.dropTable("Person");
