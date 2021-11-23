exports.up = function (knex) {
  return knex.schema.createTable('column_table', table => {
    table.increments('column_id'); // adds an auto incrementing PK column
    table.string('column_name') // name of the column
    table.json('card_ids') // array of card IDs, specifying which cards are in the column, and what order e.g. [1, 3, 2]
    table.timestamps(true, true); // adds created_at and updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('column_table');
};
