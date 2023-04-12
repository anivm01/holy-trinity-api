/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("obituary", function(table) {
        table.increments("id").primary();
        table.string('name');
        table.string('years');
        table.text('obituary');
        table.integer('date');
        table.boolean("is_draft").index("isDraft")
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("obituary");
};
