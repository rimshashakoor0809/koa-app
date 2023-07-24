/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('user_id').primary();
      table.string('name').notNullable();
      table.string('email')
        .notNullable()
        .unique();
      table.string('password').notNullable();
      table.boolean('status')
        .notNullable()
        .defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable('blogs', table => {

      table.increments('blog_id').primary();
      table.integer('author_id')
        .notNullable()
        .unsigned()
        .references('user_id')
        .inTable('users')
        .onDelete('CASCADE');

      table.string('title').notNullable();
      table.text('summary').notNullable();
      table.text('content').notNullable();
      table.boolean('published')
        .notNullable()
        .defaultTo(false);
      table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('blogs')
};
