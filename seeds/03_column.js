
exports.seed = function (knex) {
  let n = 1
  // Inserts seed entries
  return knex('column_table').insert([
    { column_name: 'OMGood', card_ids: [n++, n++, n++] },
    { column_name: 'Did not go well', card_ids: [n++, n++, n++] },
    { column_name: 'Hated', card_ids: [n++, n++, n++] },
    { column_name: 'Meh', card_ids: [n++, n++, n++] },
    { column_name: 'Super, super good', card_ids: [n++, n++, n++] },
    { column_name: 'You should just stop...', card_ids: [n++, n++, n++] },
    { column_name: 'What went well', card_ids: [n++, n++, n++] },
    { column_name: 'Not so well', card_ids: [n++, n++, n++] },
    { column_name: 'Action Items', card_ids: [n++, n++, n++] },
    { column_name: 'hello world', card_ids: [n++, n++, n++] },
  ]).onConflict('column_id').ignore();
};
