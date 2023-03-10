/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("event_bg", function(table) {
        table.increments("id").primary();
        table.boolean("bg_version");
        table.string('title');
        table.text('event_details');
        table.integer("event_date");
        table.integer("date");
        table
            .integer("en_id")
            .unsigned()
            .references("event.id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("event_bg");
};
