const { knex } = require('./knexConnector')

async function updateAddVote(user_id, card_id, vote_type) {
  return await knex.transaction(async (t) => {
    return await t('card')
      .where({ card_id })
      .select('votes')
      .then(cards => cards[0].votes)
      .then(async (votes) => {
        votes.push({ user_id, vote_type })
        await t('card')
          .where({ card_id })
          .update('votes', JSON.stringify(votes), '*')
      })
  })
}


async function updateRemoveVote(user_id, card_id, vote_type) {
  return await knex.transaction(async (t) => {
    return await t('card')
      .where({ card_id })
      .select('votes')
      .then(cards => cards[0].votes)
      .then(async (votes) => {
        votes = votes.filter(vote => vote.user_id !== user_id)
        await t('card')
          .where({ card_id })
          .update('votes', JSON.stringify(votes), '*')
      })
  })
}

module.exports = { updateAddVote, updateRemoveVote }