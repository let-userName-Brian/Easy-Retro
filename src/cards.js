const { knex } = require('./knexConnector')
const { fetchColumnsByRetroId } = require('./columns')

async function fetchCardsByRetroId(retro_id) {
  let columns = await fetchColumnsByRetroId(retro_id)

  return knex('card')
    .select('*')
    .whereIn('card_id', columns.flatMap(column => column.card_ids))
}
//columns.card_ids
module.exports = { fetchCardsByRetroId }