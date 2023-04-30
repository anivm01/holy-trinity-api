/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("article_image_gallery", function (table) {
        table.increments("id").primary();
        table
          .integer("image_id")
          .unsigned()
          .references("images.id")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table
          .integer("article")
          .unsigned()
          .references("article.id")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("article_image_gallery");
};
