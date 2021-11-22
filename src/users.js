const { knex } = require('./knexConnector')

async function getUsers(req, res) {
  let data = await knex.select('*').from('user')
  res.status(200).json(data)
}

async function getUserById(req, res) {
  let user_id = req.params.user_id
  let data = await knex.select('*').from('user').where({ user_id })
  res.status(200).json(data[0])
}

module.exports = { getUsers, getUserById }