const { knex } = require("./knexConnector")
const { v4: uuidv4 } = require('uuid');

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

//postRetro
async function postRetro(req, res) {
  //may need to revise if it gets wacky (Chasten)
  //insert the column id and name into the column table
let tags = req.body.tags
let retro_name = req.body.retro_name
let columns = req.body.column_names.map((name)=>{
  return {column_name: name}
})
let retro_id = uuidv4()
let user_id =req.params.user_id

return knex.transaction(function (t) {
  return knex('column_table')
  .transacting(t)  
  .insert(columns, 'column_id')
    .then((column_ids) => knex('retro')
      .transacting(t)
      .insert({
        retro_id: retro_id, 
        retro_name: retro_name, 
        column_ids: JSON.stringify(column_ids),
        tags: tags
      }, "retro_id"))
      .then(retro_id => { 
        t.commit 
        return retro_id
      })
      .then((retro_id) => res.json(retro_id[0]))
      .catch(t.rollback)
})
}

module.exports = { fetchRetro, getRetros, getRetroById, getRetrosByUserId, postRetro }
