exports.seed = function (knex) {
  // Inserts seed entries
  return knex('retro').insert([
    {
      retro_id: "e0fef645-088d-4f13-b53a-ccb95f4f2131",
      retro_name: "Chasten's Thoughts on Mjolnir",
      column_ids: JSON.stringify([1, 2, 3]),
      tags: ["aypples", "banaynays"]
    },
    {
      retro_id: "78557390-b5bb-4a3f-80d2-795814f99f66",
      column_ids: JSON.stringify([4, 5, 6]),
      tags: ["ooples", "banoonoos"]
    },
    {
      retro_id: "9202ffb1-7086-4ac0-9f5a-597fcf620429",
      retro_name: "Some More Froots",
      column_ids: JSON.stringify([7, 8, 9]),
      tags: ["ipples", "baninis"]
    }
  ]).onConflict('retro_id').ignore();
};
