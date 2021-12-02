const loremHipsum = require('lorem-hipsum')

exports.seed = function (knex) {
  let arr = []
  for (let comment_id = 1; comment_id < 31; comment_id++) {
    arr.push({
      comment_text: loremHipsum({
        count: 1,
        units: 'sentences',
        sentenceLowerBound: 5,
        sentenceUpperBound: 15
      }),
      user_id: "c1ad74ae-b651-4fa0-9820-833193797964",
      card_id: 1 + Math.floor(Math.random() * 30),
      // reactions: JSON.stringify([{ "c1ad74ae-b651-4fa0-9820-833193797964": "banana" }])
    })
  }
  // Inserts seed entries
  return knex('comment').insert(arr).onConflict('comment_id').ignore();
};
