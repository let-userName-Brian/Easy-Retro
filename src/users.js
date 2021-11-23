const { knex } = require('./knexConnector')

async function getUsers(req, res) {
  let data = await knex.select('*').from('user_profile')
  res.status(200).json(data)
}

async function getUserById(req, res) {
  let user_id = req.params.user_id
  let data = await knex.select('*').from('user_profile').where({ user_id })
  res.status(200).json(data[0])
}

module.exports = { getUsers, getUserById }