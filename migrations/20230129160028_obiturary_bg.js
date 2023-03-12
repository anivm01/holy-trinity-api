/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("obituary_bg", function(table) {
        table.increments("id").primary();
        table.boolean("bg_version");
        table.string('name');
        table.string('years');
        table.text('obituary');
        table.integer('date');
        table
            .integer("en_id")
            .unsigned()
            .references("obituary.id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("obituary_bg");
};
