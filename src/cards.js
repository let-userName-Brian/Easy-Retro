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

async function fetchCardsByColumnId(column_id) {
  let card_ids = await fetchCardIdsByColumnId(column_id)
  return knex('card')
    .join('user_profile', 'card.user_id', '=', 'user_profile.user_id')
    .whereIn('card_id', card_ids)
    .select('card.*', 'user_profile.user_name')
}

async function fetchCardIdsByColumnId(column_id) {
  return await knex('column_table')
    .select('card_ids')
    .where({ column_id })
    .then(columns => columns[0].card_ids)
}

async function fetchCardByCardId(card_id) {
  return knex('card')
    .join('user_profile', 'card.user_id', '=', 'user_profile.user_id')
    .select('card.*', 'user_profile.user_name')
    .where({ card_id })
    .then(cards => cards[0])
}

/**
 * @param {*} column_id
 * @param {string} user_id the uuid of the user. is not yet implemented
 * @returns creates a new card and attaches it to the provided column
 */
async function insertNewCard(column_id, user_id) {
  return await knex.transaction(async (t) => {
    return await t('card')
      .insert({ card_text: 'New Card', user_id }, 'card_id')
      .then(async (new_card_id) => await knex.raw('update column_table set card_ids = card_ids || ? where column_id = ?;', [new_card_id, column_id]))
  })
}

//refactored from columns but untested
async function deleteCard(retro_id, column_id, card_id) {
  return await knex.transaction(async (t) => {
    return await t('card')
      .where({ card_id })
      .del()
      .then(async () => await t('column_table')
        .where({ column_id })
        .update('card_ids', knex.raw('array_remove(card_ids, ?:: int)', [card_id]), 'card_ids')
      )
  })
}

async function updateCardText(card_id, card_text) {
  return await knex('card')
    .where({ card_id })
    .update({ card_text }, '*')
    .then(cards => cards[0])
}

module.exports = { fetchCardsByRetroId, fetchCardsByColumnId, fetchCardIdsByColumnId, fetchCardByCardId, insertNewCard, deleteCard, updateCardText }