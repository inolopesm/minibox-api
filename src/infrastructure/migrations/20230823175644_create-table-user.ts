import { Knex } from "knex";

export const up = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema.createTable("User", (table) => {
    table.increments("id");
    table.string("username", 24).notNullable().unique();
    table.string("password", 255).notNullable();
  });

export const down = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema.dropTable("User");
