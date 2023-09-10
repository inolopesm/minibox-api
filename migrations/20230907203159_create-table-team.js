exports.up = (knex) => knex.schema.createTable("Team", (table) => {
  table.increments("id");
  table.string("name", 24).notNullable().unique();
});

exports.down = (knex) => knex.schema.dropTable("Team");
