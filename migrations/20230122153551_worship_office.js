/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("worship_office", function(table) {
        table.increments("id").primary();
        table.string('title').notNullable();
        table.string('title_bg').notNullable();
        table.text('gospel').notNullable();
        table.text('gospel_bg').notNullable();
        table.text('epistle').notNullable();
        table.text('epistle_bg').notNullable();
        table.text('old_testament').notNullable();
        table.text('old_testament_bg').notNullable();
        table.string('youtube_video_id').notNullable();
        table.integer('date').notNullable();
        table
            .integer("thumbnail_id")
            .unsigned()
            .references("images.id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("worship_office");
};
