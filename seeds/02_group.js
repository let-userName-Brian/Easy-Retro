exports.seed = function (knex) {
  // Inserts seed entries
  return knex('group').insert([
    { group_id: 1, group_name: 'Floyd\'s group' },
    { group_id: 2, group_name: 'Mario\'s group' },
    { group_id: 3, group_name: 'Brian\'s group', parent_group: null },
    { group_id: 4, group_name: 'Dustin\'s group', parent_group: 1 },
    { group_id: 5, group_name: 'Stephen\'s group', parent_group: 2 },
    { group_id: 6, group_name: 'Chasten\'s group', parent_group: 3 },
    { group_id: 7, group_name: 'James\' group', parent_group: 4 }
  ]).onConflict('group_id').ignore()
};
