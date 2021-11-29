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
}

/**
 * refactor this to cards.js implementation
 * @param {*} retro_id
 * @returns inserts a new column into the provided retro
 */
async function insertNewColumn(retro_id) {
  return await knex.transaction(async (t) => {
    return await t('column_table')
      .insert({ column_name: 'New Column' }, 'column_id')
      .then(async (new_column_id) => knex.raw('update retro set column_ids = column_ids || ? where retro_id = ?;', [new_column_id, retro_id]))
  })
}

module.exports = { getColumnsByRetroId, fetchColumnsByRetroId, fetchColumnById, insertNewColumn }