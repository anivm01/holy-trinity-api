/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("article", function(table) {
        table.increments("id").primary();
        table.string('title');
        table.string('author');
        table.text('content');
        table.integer("date");
        table.boolean("is_draft").index("isDraft");
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("article");
};
