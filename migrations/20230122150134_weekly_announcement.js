/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("weekly_announcement", function(table) {
        table.increments("id").primary();
        table.string('title').notNullable();
        table.text('announcement').notNullable();
        table.integer("date").notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("weekly_announcement");
};
