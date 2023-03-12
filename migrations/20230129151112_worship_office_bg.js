/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("worship_office_bg", function(table) {
        table.increments("id").primary();
        table.boolean("bg_version");
        table.string('title');
        table.text('gospel');
        table.text('epistle');
        table.text('old_testament');
        table.string('youtube_video_id');
        table.integer('date');
        table
        .integer("en_id")
        .unsigned()
        .references("worship_office.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("worship_office_bg");
};
