exports.up = (knex) => knex.schema.createTable("Invoice", (table) => {
  table.increments("id");
  table.integer("personId").notNullable();
  table.bigInteger("createdAt").notNullable();
  table.bigInteger("paidAt");
  table.foreign("personId").references("id").inTable("Person");
});

exports.down = (knex) => knex.schema.dropTable("Invoice");
