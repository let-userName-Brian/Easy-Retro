exports.up = function (knex) {
  return knex.schema.createTable('card', table => {
    table.increments('card_id'); // adds an auto incrementing PK column
    table.string('card_text') // body text of the card
    table.uuid('user_id') // User ID identifying who created the card
      .references('user_id').inTable('user_profile')
      .onUpdate('CASCADE').onDelete('CASCADE')
    table.json('votes').defaultTo([]) // Array of objects { user_id: vote_type }, default value may cause us problems
    table.timestamps(true, true); // adds created_at and updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('card');
};
