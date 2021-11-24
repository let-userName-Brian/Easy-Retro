const { knex } = require('./knexConnector')
const { fetchColumnsByRetroId } = require('./columns')

async function fetchCardsByRetroId(retro_id) {
  let columns = await fetchColumnsByRetroId(retro_id)

  return knex('card')
    .join('user_profile', 'card.user_id', '=', 'user_profile.user_id')
    .whereIn('card_id', columns.flatMap(column => column.card_ids))
    .select('card.*', 'user_profile.user_name')
}

module.exports = { fetchCardsByRetroId }