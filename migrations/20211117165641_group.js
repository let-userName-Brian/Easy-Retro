exports.up = function (knex) {
  return knex.schema.createTable('group', table => {
    table.increments('group_id'); // adds an auto incrementing PK column
    table.string('group_name')
    table.integer('parent_group') // group_id of parent_group
    table.timestamps(true, true); // adds created_at and updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('group');
};
