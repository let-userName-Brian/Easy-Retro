exports.seed = function (knex) {
  // Inserts seed entries
  let n = 1;
  return knex('retro').insert([
    {
      retro_id: "e0fef645-088d-4f13-b53a-ccb95f4f2131",
      retro_name: "Chasten's Thoughts on Mjolnir",
      column_ids: [n++, n++, n++, n++],
      tags: ["aypples", "banaynays"],
      max_votes: 5,
    },
    {
      retro_id: "78557390-b5bb-4a3f-80d2-795814f99f66",
      column_ids: [n++, n++, n++],
      tags: ["ooples", "banoonoos"]
    },
    {
      retro_id: "9202ffb1-7086-4ac0-9f5a-597fcf620429",
      retro_name: "Some More Froots",
      column_ids: [n++, n++, n++],
      tags: ["ipples", "baninis"],
      max_votes: 13,
    }
  ]).onConflict('retro_id').ignore();
};
