exports.up = (knex) => knex.schema.createTable("Person", (table) => {
  table.increments("id");
  table.integer("teamId").notNullable();
  table.string("name", 24).notNullable().unique();
  table.foreign("teamId").references("id").inTable("Team");
});

exports.down = (knex) => knex.schema.dropTable("Person");
