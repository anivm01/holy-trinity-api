exports.up = function (knex) {
    return knex.schema.createTable('resource_order', table => {
        table.integer('resource_id').unsigned().notNullable().references('id').inTable('priest_resources').onDelete('CASCADE');
        table.integer('category_id').unsigned().notNullable().references('id').inTable('resource_categories').onDelete('CASCADE');
        table.integer('order').notNullable();

        // You can choose to make the combination of resource_id and category_id a primary key if each resource belongs to only one category
        // This ensures that each resource can have only one order per category
        table.primary(['resource_id', 'category_id']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('resource_order');
};