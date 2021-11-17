exports.up = function (knex) {
  return knex.schema.createTable('user_retro', table => {
    table.uuid('user_id')
      .references('user_id').inTable('user')
      .onUpdate('CASCADE').onDelete('CASCADE')

    table.integer('retro_id')
      .references('retro_id').inTable('retro')
      .onUpdate('CASCADE').onDelete('CASCADE')

    table.boolean('is_facilitator').notNullable().defaultTo(false)

    table.timestamps(true, true); // adds created_at and updated_at
    table.primary(['user_id', 'retro_id'])
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('user_retro');
};
