exports.up = function (knex) {
  return knex.schema.createTable('user_profile', table => {
    table.uuid('user_id').primary().notNullable(); // UUID provided by platform one
    table.string('user_name')
    table.boolean('is_dark_mode').notNullable().defaultTo(false) // flag if user is using dark mode
    table.timestamps(true, true); // adds created_at and updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('user_profile');
};
