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

async function getRetroByUserId(req, res){
  let user_id= req.params.user_id
  return await knex('user_retro')
    .select('retro_id')
    .where({user_id})
    .then(retros => retros.map(id => 
      knex('retro')
        .select('*')
        .where('retro_id', id.retro_id)
        .then(result=> res.json(result))
        ))
}

module.exports = { getRetros, getRetroById, getRetroByUserId}