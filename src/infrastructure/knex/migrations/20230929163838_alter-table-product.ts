import type { Knex } from "knex";

export const up = (knex: Knex): Knex.SchemaBuilder =>
  knex.schema.alterTable("Product", (table) => {
    table.string("name", 48).notNullable().alter();
  });

export const down = async (knex: Knex): Promise<void> => {
  await knex("Product")
    .where(knex.raw("LENGTH(name)"), ">", 24)
    .update("name", knex.raw("SUBSTR(name, 1, 20)"));

  await knex.schema.alterTable("Product", (table) => {
    table.string("name", 24).notNullable().alter();
  });
};
