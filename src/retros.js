const { knex } = require("./knexConnector")

async function getRetros(req, res) {
  await knex('retro')
    .select('*')
    .then(retros => res.json(retros))
}

async function getRetroById(req, res) {
  let retro_id = req.params.retro_id
  fetchRetro(retro_id)
    .then(retros => res.json(retros[0]))
}

async function fetchRetro(retro_id) {
  return await knex('retro')
    .select('*')
    .where({ retro_id })
}

module.exports = { getRetros, getRetroById }