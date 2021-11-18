exports.seed = function (knex) {
  let arr = []
  for (let card_id = 1; card_id < 50; card_id++) {
    arr.push({
      card_id,
      card_text: "Four dollar toast photo booth chia selfies biodiesel occupy chambray VHS snackwave.",
      user_id: "c1ad74ae-b651-4fa0-9820-833193797964",
      votes: { "c1ad74ae-b651-4fa0-9820-833193797964": "up_vote" }
    })
  }
  // Inserts seed entries
  return knex('card').insert(arr).onConflict('card_id').ignore();
};
