const { knex } = require('./knexConnector')
const jwt = require('jsonwebtoken');

async function getUsers(req, res) {
  let data = await knex.select('*').from('user_profile')
  res.status(200).json(data)
}

async function getUserById(req, res) {
  let user_id = req.params.user_id
  let data = await knex.select('*').from('user_profile').where({ user_id })
  res.status(200).json(data[0])
}

async function fetchUserNameById(user_id) {
  return knex('user')
    .select('user_name')
    .where({ user_id })
}

async function login(req, res) {
  let token = jwt.decode(req.headers.jwt)

  if (!token) {
    let user_id = '1c1543a6-9cdd-4616-a5d7-3021b0bf40ad'
    let user = await knex('user')
      .select('*')
      .where({ user_id })
    res.json(user[0])
    return
  }

  let user_id = token.sub
  let user_name = token.name

  let user = await knex('user')
    .select('*')
    .where({ user_id })

  if (user.length === 0) {
    user = await knex('user')
      .insert({ user_id, user_name })
  }

  res.json(user[0])
}

module.exports = { getUsers, getUserById, login }