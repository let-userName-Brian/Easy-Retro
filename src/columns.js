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

function insertNewColumn(retro_id) {
  return knex('column_table')
    .insert({ column_name: 'New Column' }, 'column_id') // New column [42]
    .then((new_column_ids) => {
      return knex('retro')
        .where({ retro_id })
        .select('column_ids') // [[1, 2, 3]]
        .then((retroObj) => {
          console.log('retroObj', retroObj)
          const columnArray = retroObj[0].column_ids.concat(new_column_ids); // [1, 2, 3] + [42] = [1, 2, 3, 42]
          return knex('retro')
            .where({ retro_id })
            .update({ column_ids: JSON.stringify(columnArray) })
        })
    })
}

module.exports = { getColumnsByRetroId, fetchColumnsByRetroId, insertNewColumn }