exports.seed = function (knex) {
  // Inserts seed entries
  return knex('retro').insert([
    {
      retro_id: 1,
      retro_name: "Chasten's Thoughts on Mjolnir",
      column_ids: JSON.stringify([1, 2, 3]),
      tags: ["aypples", "banaynays"]
    },
    {
      retro_id: 2,
      column_ids: JSON.stringify([4, 5, 6]),
      tags: ["ooples", "banoonoos"]
    },
    {
      retro_id: 3,
      retro_name: "Some More Froots",
      column_ids: JSON.stringify([7, 8, 9]),
      tags: ["ipples", "baninis"]
    }
  ]).onConflict('retro_id').ignore();
};
