const { fetchRetro } = require('./retros')
const { getColumnsByRetroId } = require('./columns')

async function fetchCardsByRetroId(retro_id) {
  let columns = await fetchColumnsByRetroId(retro_id)

  return knex('card')
  .select('*')
  .wherein('card_id', columns.flatMap(column => column.card_ids))
}
//columns.card_ids
module.exports = { fetchCardsByRetroId }