const loremHipsum = require('lorem-hipsum')

exports.seed = function (knex) {
  let arr = []

  for (let card_id = 1; card_id < 31; card_id++) {
    let votes = []
    let maxVotes = Math.floor(Math.random() * 10)
    for (let v = 0; v < maxVotes; v++) {
      votes.push({ user_id: "0e5639ea-8868-4bf6-ab5f-cb8a8d470785", vote_type: "up" })
    }

    arr.push({
      card_text: loremHipsum({
        count: 1,
        units: 'sentences',
        sentenceLowerBound: 5,
        sentenceUpperBound: 15
      }),
      user_id: "c1ad74ae-b651-4fa0-9820-833193797964",
      votes: JSON.stringify(votes)
    })
  }
  // Inserts seed entries
  return knex('card').insert(arr).onConflict('card_id').ignore();
};
