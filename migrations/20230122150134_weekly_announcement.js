/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("weekly_announcement", function(table) {
        table.increments("id").primary();
        table.string('title');
        table.text('announcement');
        table.integer("date");
        table.boolean("is_draft").index("isDraft");
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("weekly_announcement");
};
