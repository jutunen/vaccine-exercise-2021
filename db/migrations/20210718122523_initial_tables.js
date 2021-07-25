
exports.up = function (knex) {
    return knex.schema
        .createTable('bottle', function (table) {
            table.uuid('id').primary();
            table.integer('order_number').notNullable();
            table.integer('injections').notNullable();
            table.string('responsible_person').notNullable();
            table.string('healthcare_district').notNullable();
            table.string('vaccine').notNullable();
            table.timestamp('arrived').notNullable();
            table.timestamp('expired').defaultTo(knex.fn.now());
        })
        .createTable('vaccination', function (table) {
            table.uuid('id').primary();
            table.uuid('bottle').references('id').inTable('bottle');
            table.string('gender').notNullable();
            table.timestamp('date').notNullable();
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTable("vaccination")
        .dropTable("bottle");
};