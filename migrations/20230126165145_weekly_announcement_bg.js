/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("weekly_announcement_bg", function(table) {
        table.increments("id").primary();
        table.string('title').notNullable();
        table.text('announcement').notNullable();
        table.integer("date").notNullable();
        table
            .integer("en_id")
            .unsigned()
            .references("weekly_announcement.id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("weekly_announcement_bg");
};
