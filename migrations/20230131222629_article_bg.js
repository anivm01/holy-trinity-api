/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("article_bg", function(table) {
        table.increments("id").primary();
        table.string('title').notNullable();
        table.text('content').notNullable();
        table.integer("date_posted").notNullable();
        table
            .integer("featured_img_id")
            .unsigned()
            .references("images.id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")
        table
            .integer("en_id")
            .unsigned()
            .references("article.id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("article_bg");
};
