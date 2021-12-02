exports.up = function (knex) {
  return knex.schema.createTable('comment', table => {
    table.increments('comment_id'); // adds an auto incrementing PK column
    table.string('comment_text') // body text of the comment

    table.uuid('user_id') // User ID identifying who created the comment
      .references('user_id').inTable('user_profile')
      .onUpdate('CASCADE').onDelete('CASCADE')

    table.integer('card_id') // The card that this comment has been attached to
      .references('card_id').inTable('card')
      .onUpdate('CASCADE').onDelete('CASCADE')

    // table.json('reactions') // Array of objects { user_id: reaction_type }
    table.timestamps(true, true); // adds created_at and updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('comment');
};
