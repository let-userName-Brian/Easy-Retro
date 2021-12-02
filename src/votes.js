const { knex } = require('./knexConnector')

async function updateAddVote(user_id, card_id, vote_type) {
  // console.log('updateAddVote', user_id, card_id, vote_type)
  return await knex.transaction(async (t) => {
    return await t('card')
      .where({ card_id })
      .select('votes')
      .then(cards => cards[0].votes)
      .then(async (votes) => {
        // console.log('Current votes:', votes)
        votes.push({ user_id, vote_type })
        // console.log('New votes:', votes)
        t('card')
          .where({ card_id })
          .update('votes', JSON.stringify(votes), '*')
          .then(cards => console.log('Card:', cards[0]))
      })
  }
  )
}


async function updateRemoveVote(user_id, card_id, vote_type) {
  // console.log('updateRemoveVote', user_id, card_id, vote_type)
  return await knex.transaction(async (t) => {
    return await t('card')
      .where({ card_id })
      .select('votes')
      .then(cards => cards[0].votes)
      .then(async (votes) => {
        // console.log('Current votes:', votes)
        votes = votes.filter(vote => vote.user_id !== user_id)
        // console.log('New votes:', votes)
        t('card')
          .where({ card_id })
          .update('votes', JSON.stringify(votes), '*')
          .then(cards => console.log('Card:', cards[0]))

      })
  }
  )
}

module.exports = { updateAddVote, updateRemoveVote }