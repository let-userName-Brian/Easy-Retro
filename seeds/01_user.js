exports.seed = function (knex) {
  // Inserts seed entries
  return knex('user_profile').insert([
    { user_id: "c1ad74ae-b651-4fa0-9820-833193797964", user_name: 'Floyd Thormodson', is_dark_mode: true },
    { user_id: "0e5639ea-8868-4bf6-ab5f-cb8a8d470785", user_name: 'Mario Davies', is_dark_mode: false },
    { user_id: "a4e73f0d-60c2-4c30-8e7a-d54f637a8760", user_name: 'Brian Hardy', is_dark_mode: true },
    { user_id: "1c1543a6-9cdd-4616-a5d7-3021b0bf40ad", user_name: 'Dustin Stringer', is_dark_mode: true },
    { user_id: "325353e8-dac3-4e3d-bbc0-8d02de38d1ff", user_name: 'Stephen California', is_dark_mode: true },
    { user_id: "7c8c5100-544d-45f3-9cee-3fed3d1a9a5d", user_name: 'Chasten Warnal', is_dark_mode: true },
    { user_id: "e8c00cd6-4077-470f-8b61-17a4a1386959", user_name: 'James Warhammer' }
  ]).onConflict('user_id').ignore();
};
