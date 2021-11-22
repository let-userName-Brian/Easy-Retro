const { knex } = require("./knexConnector")
const uuid = require('uuid')

async function getRetros(req, res) {
  await knex('retro')
    .select('*')
    .then(retros => res.json(retros))
}

async function getRetroById(req, res) {
  let retro_id = req.params.retro_id
  await fetchRetro(retro_id)
    .then(retro => res.json(retro))
}

async function fetchRetro(retro_id) {
  return await knex('retro')
    .select('*')
    .where({ retro_id })
    .then(retros => retros[0])
}

async function getRetrosByUserId(req, res) {
  let user_id = req.params.user_id
  knex('retro')
    .innerJoin('user_retro','retro.retro_id', 'user_retro.retro_id' )
    .where({ user_id})
    .then(data => res.json(data))
    .catch(err => console.log(err))
}

module.exports = { fetchRetro, getRetros, getRetroById, getRetrosByUserId }
