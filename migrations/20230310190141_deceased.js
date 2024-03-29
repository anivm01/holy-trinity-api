/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("deceased", function (table) {
      table.increments("id").primary();
        table
        .integer("image_id")
        .unsigned()
        .references("images.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("obituary")
        .unsigned()
        .references("obituary.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      });
 
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("deceased");
};
