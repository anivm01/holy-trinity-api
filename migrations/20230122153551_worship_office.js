/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("worship_office", function(table) {
        table.increments("id").primary();
        table.string('title');
        table.text('gospel');
        table.text('epistle');
        table.text('old_testament');
        table.string('youtube_video_id');
        table.integer('date');
        table.boolean("is_draft").index("isDraft")
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
