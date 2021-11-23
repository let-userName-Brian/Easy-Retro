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
  //insert the column id and name into the column table
let tags =req.body.tags
let retro_name = req.body.retro_name
let column_id = req.body.column_id
let column_name = req.body.column_name
let retro_id = uuidv4()
return await knex('column')
  .insert({column_id, column_name})
  .innerJoin('retro', 'column.column_id', 'retro.column_id')
  .then(() => knex('retro')
    .insert({
      retro_id: retro_id, 
      retro_name: retro_name, 
      column_id: column_id,
      tags: tags
    }))
      .then(res => res.send(retro_id))
}

// insert into retro(retro_id, retro_name, tags) 
// values ('9202ffb1-7086-4ac0-9f5a-597fcf620425', 'testing', '{worked, maybe}');

// console.log('body:',req.body)
// let tags =req.body.tags
// let retro_name = req.body.retro_name
// let column_id = req.body.column_id
// //let column_name = req.body.column_name
// let retro_id = uuidv4()
// return await knex('retro')
//   .insert({
//     retro_id: retro_id, 
//     retro_name: retro_name, 
//     column_id: column_id,
//     tags: tags})
//   //.then(res.send(retro_id))
//   //insert column names where the column ID matches with the column name
//   .catch(err => console.log(err))
//   .then(() => knex('column')
//     .innerJoin('retro', 'retro.column_id', 'column.column_id')
//     .insert({column_name: '[column_name]'})
//     )

module.exports = { fetchRetro, getRetros, getRetroById, getRetrosByUserId, postRetro }
