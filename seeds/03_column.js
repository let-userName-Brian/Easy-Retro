
exports.seed = function (knex) {
  let n = 1
  // Inserts seed entries
  return knex('column').insert([
    { column_id: 1, column_name: 'OMGood', card_ids: JSON.stringify([n++, n++, n++]) },
    { column_id: 2, column_name: 'Did not go well', card_ids: JSON.stringify([n++, n++, n++]) },
    { column_id: 3, column_name: 'Hated', card_ids: JSON.stringify([n++, n++, n++]) },
    { column_id: 4, column_name: 'Meh', card_ids: JSON.stringify([n++, n++, n++]) },
    { column_id: 5, column_name: 'Super, super good', card_ids: JSON.stringify([n++, n++, n++]) },
    { column_id: 6, column_name: 'You should just stop...', card_ids: JSON.stringify([n++, n++, n++]) },
    { column_id: 7, column_name: 'What went well', card_ids: JSON.stringify([n++, n++, n++]) },
    { column_id: 8, column_name: 'Not so well', card_ids: JSON.stringify([n++, n++, n++]) },
    { column_id: 9, column_name: 'Action Items', card_ids: JSON.stringify([n++, n++, n++]) },
  ]).onConflict('column_id').ignore();
};
