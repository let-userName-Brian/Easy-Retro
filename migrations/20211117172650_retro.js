exports.up = function (knex) {
  return knex.schema.createTable('retro', table => {
    table.uuid('retro_id').primary();
    table.string('retro_name').defaultTo('New Retro')
    table.specificType('column_ids', 'int[]') // array of column IDs, specifying which columns are in the retro, and what order e.g. [1, 3, 2]
    table.json('retro_options').defaultTo({}) // object of key-value pairs, defining options for the retro
    table.specificType('tags', 'text[]')
    table.timestamps(true, true); // adds created_at and updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('retro');
};
