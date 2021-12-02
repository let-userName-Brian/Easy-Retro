const { knex } = require("./knexConnector")
const { fetchRetro } = require('./retros')

/**
 * Fetch function to return all columns in json format
 */
async function getColumnsByRetroId(req, res) {
  retro_id = req.params.retro_id
  fetchColumnsByRetroId(retro_id).then(columns => res.json(columns))
}

/**
 * Gets all columns from the database
 * @param {string} retro_id The UUID of the retro
 * @returns An array of column objects
 */
async function fetchColumnsByRetroId(retro_id) {
  let retro = await fetchRetro(retro_id)
  return knex('column_table')
    .select('*')
    .whereIn('column_id', retro.column_ids)
}

async function fetchColumnById(column_id) {
  return knex('column_table')
    .select('*')
    .where({ column_id })
    .then(columns => columns[0])
}

/**
 * refactor this to cards.js implementation
 * @param {*} retro_id
 */
async function insertNewColumn(retro_id) {
  return await knex.transaction(async (t) => {
    return await t('column_table')
      .insert({ column_name: 'New Column' }, 'column_id')
      .then(async (new_column_id) => {
        await t('retro')
          .where({ retro_id })
          .update('column_ids', knex.raw('array_cat(column_ids, ?)', [new_column_id]), 'column_ids')
        return new_column_id[0]
      })
  })
}

async function deleteColumn(retro_id, column_id) {
  return await knex.transaction(async (t) => {
    return await t('column_table')
      .where({ column_id })
      .del()
      .then(async () => await t('retro')
        .where({ retro_id })
        .update('column_ids', knex.raw('array_remove(column_ids, ?:: int)', [column_id]), 'column_ids')
      )
  })
}

async function updateColName(column_id, column_name) {
  return await knex('column_table')
    .where({ column_id })
    .update({ column_name }, '*')
    .then(columns => columns[0])
}

async function fetchColumnIdByCardId(card_id) {
  return await knex('column_table')
    .whereRaw('? = ANY(card_ids)', card_id)
    .select('column_id')
    .then(columns => columns[0].column_id)
}

module.exports = { getColumnsByRetroId, fetchColumnsByRetroId, fetchColumnById, insertNewColumn, deleteColumn, updateColName, fetchColumnIdByCardId }