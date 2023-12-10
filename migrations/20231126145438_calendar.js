/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("calendar", function (table) {
        table.increments("id").primary();
        table.string('title');
        table.string('title_bg');
        table.text('details');
        table.text('details_bg');
        table.integer("date");
        table.text('gospel_reference');
        table.text('gospel');
        table.text('gospel_reference_bg');
        table.text('gospel_bg');
        table.text('epistle_reference');
        table.text('epistle');
        table.text('epistle_reference_bg');
        table.text('epistle_bg');
        table.text('old_testament_reference');
        table.text('old_testament');
        table.text('old_testament_reference_bg');
        table.text('old_testament_bg');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("calendar");
};
