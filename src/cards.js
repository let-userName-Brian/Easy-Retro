const { knex } = require('./knexConnector')
const { fetchColumnsByRetroId } = require('./columns')

/**
 *
 * @param {*} retro_id
 * @returns all cards associated with a retro_id and the userName associated with each card
 */
async function fetchCardsByRetroId(retro_id) {
  let columns = await fetchColumnsByRetroId(retro_id)

  return knex('card')
    .join('user_profile', 'card.user_id', '=', 'user_profile.user_id')
    .whereIn('card_id', columns.flatMap(column => column.card_ids))
    .select('card.*', 'user_profile.user_name')
}

async function fetchCardIdsByColId(column_id) {
  return knex('column_table')
    .select('card_ids')
    .where({ column_id })
}

async function fetchCardsByColId(column_id) {
  return knex('column_table')
    .select('*')
    .where({ column_id })
}

/**
 * @param {*} column_id
 * @param {string} user_id the uuid of the user. is not yet implemented
 * @returns creates a new card and attaches it to the provided column
 */
async function insertNewCard(column_id, user_id) {
  return await knex.transaction(async (t) => {
    return await t('card')
      .insert({ card_text: 'New Card', user_id: user_id }, 'card_id')
      .then(async (new_card_id) => await knex.raw('update column_table set card_ids = card_ids || ? where column_id = ?;', [new_card_id, column_id]))
  })
}

module.exports = { fetchCardsByRetroId, fetchCardsByColId, insertNewCard, fetchCardIdsByColId }