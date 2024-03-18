exports.up = function (knex) {
    return knex.schema.table('resource_categories', function (table) {
        table.integer('order').notNullable().defaultTo(0);
    });
};

exports.down = function (knex) {
    return knex.schema.table('resource_categories', function (table) {
        table.dropColumn('order');
    });
};