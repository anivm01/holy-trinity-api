/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("users", function (table) {
        table.increments("id").primary();
        table.string('name');
        table.string('email').unique().notNullable();
        table.string('password').notNullable();
        table.boolean('admin').defaultTo(false);
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("users");
};
