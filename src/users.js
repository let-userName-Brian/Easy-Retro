const { knex } = require('./knexConnector')

async function getUsers(req, res) {
  let data = await knex.select('*').from('user')
  res.status(200).json(data)
}

module.exports = { getUsers }