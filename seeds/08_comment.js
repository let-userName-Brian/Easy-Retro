
exports.seed = function (knex) {
  let arr = []
  for (let comment_id = 1; comment_id < 50; comment_id++) {
    arr.push({
      comment_id,
      comment_text: "Four dollar toast photo booth chia selfies biodiesel occupy chambray VHS snackwave.",
      user_id: "c1ad74ae-b651-4fa0-9820-833193797964",
      card_id: 1 + Math.floor(Math.random() * 49),
      reactions: { "c1ad74ae-b651-4fa0-9820-833193797964": "banana" }
    })
  }
  // Inserts seed entries
  return knex('comment').insert(arr).onConflict('comment_id').ignore();
};
