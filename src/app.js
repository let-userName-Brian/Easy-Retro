const express = require('express');
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV || 'development']);
const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.status(200).send('Welcome to Super Mario World!');
});

app.get('/users', (req, res) => {
  knex.select('*').from('user').then(data => res.json(data))
})

const server = app.listen(port, () => {
  console.log(`Dropping the hammer on port:${port}`);
})

module.exports = server;