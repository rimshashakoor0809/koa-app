const Knex = require('knex');
const { Model } = require('objection');

const knex = Knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PORT,
  },
});

Model.knex(knex);

module.exports = { knex };