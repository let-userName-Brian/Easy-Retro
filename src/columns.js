const { knex } = require("./knexConnector")
const { fetchRetro } = require('./retros')

async function getColumnsByRetroId(req, res) {
  retro_id = req.params.retro_id
  fetchColumnsByRetroId(retro_id).then(columns => res.json(columns))
}

async function fetchColumnsByRetroId(retro_id) {
  let { column_ids } = await fetchRetro(retro_id)
  return knex('columns')
    .select('*')
    .where({ column_ids })
}

module.exports = { getColumnsByRetroId, fetchColumnsByRetroId }