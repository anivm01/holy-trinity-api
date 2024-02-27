/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // Step 1: Create the temporary table with the new structure
    await knex.schema.createTable("temp_event", function (table) {
        table.increments("id").primary();
        table.integer("event_date");
        table.string('title');
        table.string('title_bg');
        table.boolean('is_default').defaultTo(true);
        table.text('event_details');
        table.text('event_details_bg');
        // Assuming that 'en_id' from event_bg relates to 'id' in event, no foreign key here as it's a merge
    });

    // Step 2: Copy and merge data from both the event and event_bg tables
    // This is a simplified example; adjust based on your actual data merging logic
    await knex.raw(`
    INSERT INTO temp_event (id, event_date, title, title_bg, is_default, event_details, event_details_bg)
    SELECT e.id, e.event_date, e.title, bg.title as title_bg, TRUE as is_default, e.event_details, bg.event_details as event_details_bg
    FROM event e
    LEFT JOIN event_bg bg ON e.id = bg.en_id    
    `);

    // Drop the old tables
    await knex.schema.dropTableIfExists("event_bg");
    await knex.schema.dropTableIfExists("event");

    // Rename the temporary table to the original 'event' table name
    await knex.schema.renameTable("temp_event", "event");
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    // Placeholder: Implement rollback strategy here or document manual steps
    console.log('Rollback of this migration is not automated. Please refer to the manual rollback documentation.');
};

