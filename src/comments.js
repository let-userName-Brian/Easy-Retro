const { knex } = require('./knexConnector')
const { fetchCardsByRetroId } = require('./cards')

async function fetchCommentsByRetroId(retro_id) {
  let cards = await fetchCardsByRetroId(retro_id)

  return knex('comment')
    .join('user_profile', 'comment.user_id', '=', 'user_profile.user_id')
    .whereIn('card_id', cards.map(card => card.card_id))
    .select('comment.*', 'user_profile.user_name')
}

module.exports = { fetchCommentsByRetroId }