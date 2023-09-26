/** @type {import("knex").Knex.Config} */
module.exports = {
  client: "pg",
  connection: process.env.POSTGRES_URL,
};
