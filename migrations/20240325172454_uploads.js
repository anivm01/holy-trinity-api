/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("uploads", function (table) {
        table.increments("id").primary();
        table.string("fileName");
        table.string("url");
        table.string("fileType");
        table.text("caption"); // Optional
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("uploads");
};
