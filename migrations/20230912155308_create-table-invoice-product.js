/** @param {import("knex").Knex} knex */
exports.up = (knex) => knex.schema.createTable("InvoiceProduct", (table) => {
  table.increments("id");
  table.integer("invoiceId").notNullable();
  table.string("name", 24).notNullable();
  table.integer("value").notNullable();
  table.foreign("invoiceId").references("id").inTable("Invoice");
});

/** @param {import("knex").Knex} knex */
exports.down = (knex) => knex.schema.dropTable("InvoiceProduct");
