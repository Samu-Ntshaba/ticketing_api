exports.up = function(knex) {
    return knex.schema.table('tickets', function(table) {
        table.string('ticket_title').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.table('tickets', function(table) {
        table.dropColumn('ticket_title');
    });
};
