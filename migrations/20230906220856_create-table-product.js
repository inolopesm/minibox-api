exports.up = (knex) => knex.schema.createTable("Product", (table) => {
  table.increments("id");
  table.string("name", 24).notNullable().unique();
  table.integer("value").notNullable();
});

exports.down = (knex) => knex.schema.dropTable("Product");
