exports.up = function (knex) {
  return knex.schema.createTable('column_table', table => {
    table.increments('column_id'); // adds an auto incrementing PK column
    table.string('column_name') // name of the column
    table.specificType('card_ids', 'int[]').defaultTo('{}')
    table.timestamps(true, true); // adds created_at and updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('column_table');
};
