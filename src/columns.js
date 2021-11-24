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
  let column_ids = retro.column_ids
  return knex('column_table')
    .select('*')
    .whereIn('column_id', column_ids)
}

module.exports = { getColumnsByRetroId, fetchColumnsByRetroId }