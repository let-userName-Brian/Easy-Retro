exports.up = function (knex) {
  return knex.schema.createTable('user_group', table => {
    table.uuid('user_id')
      .references('user_id').inTable('user')
      .onUpdate('CASCADE').onDelete('CASCADE')

    table.integer('group_id')
      .references('group_id').inTable('group')
      .onUpdate('CASCADE').onDelete('CASCADE')

    table.boolean('is_admin').notNullable().defaultTo('false')

    table.timestamps(true, true); // adds created_at and updated_at
    table.primary(['user_id', 'group_id'])
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('user_group');
};
