/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("event", function(table) {
        table.increments("id").primary();
        table.string('title').notNullable();
        table.string('title_bg').notNullable();
        table.text('event_details').notNullable();
        table.text('event_details_bg').notNullable();
        table.integer("date").notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("event");

};
