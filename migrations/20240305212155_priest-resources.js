exports.up = function (knex) {
    return knex.schema.createTable('priest_resources', table => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.string('link').notNullable();
        table.text('description').notNullable();
        table.integer('category_id').unsigned().references('id').inTable('resource_categories').onDelete('CASCADE');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('priest_resources');
};