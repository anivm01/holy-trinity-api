/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("event", function (table) {
        table.increments("id").primary();
        table.string('title');
        table.text('event_details');
        table.integer("date");
        table.integer("event_date");
        table.boolean("is_draft").index("isDraft");
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("event");
};
