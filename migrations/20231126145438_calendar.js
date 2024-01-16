/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("calendar", function (table) {
        table.increments("id").primary();
        table.text('title');
        table.text('title_bg');
        table.integer("date");
        table.boolean('cross').defaultTo(false);
        table.boolean('bold').defaultTo(false);
        table.boolean('red').defaultTo(false);
        table.boolean('star').defaultTo(false);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("calendar");
};
