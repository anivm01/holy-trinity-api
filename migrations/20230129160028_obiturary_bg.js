/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("obituary_bg", function(table) {
        table.increments("id").primary();
        table.string('name').notNullable();
        table.string('years').notNullable();
        table.text('obituary').notNullable();
        table.integer('date').notNullable();
        table
            .integer("image_id")
            .unsigned()
            .references("images.id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")
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
