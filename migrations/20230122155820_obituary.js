/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("obituary", function(table) {
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
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("obituary");
};
