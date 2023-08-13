exports.up = function(knex) {
    return knex.schema.createTable('tickets', table => {
        table.increments('id').primary();
        table.string('ticket_number').unique().notNullable();
        table.string('ticket_description').notNullable();
        table.datetime('created_date').defaultTo(knex.fn.now());
        table.datetime('updated_date');
        table.datetime('deleted_date');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('tickets');
};
