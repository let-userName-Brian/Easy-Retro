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
 */
async function insertNewColumn(retro_id) {
  return await knex.transaction(async (t) => {
    return await t('column_table')
      .insert({ column_name: 'New Column' }, 'column_id')
      .then(async (new_column_id) => knex('retro')
        .where({ retro_id })
        // .update('column_ids', knex.raw('column_ids || ?', [new_column_id]), 'column_ids'))
        .update('column_ids', knex.raw('array_cat(column_ids, ?)', [new_column_id]), 'column_ids'))
  })
}

async function updateColName(column_id, new_name) {
  return await knex.transaction(async (t) => {
    return await t('column_table')
      .where({ column_id })
      .update({ column_name: new_name }, 'column_name')
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

module.exports = { getColumnsByRetroId, fetchColumnsByRetroId, fetchColumnById, insertNewColumn, updateColName, deleteColumn }