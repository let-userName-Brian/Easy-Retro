const express = require('express')();
const app = require('http').createServer(express);
const cors = require('cors')
const morgan = require('morgan')
const { getRetros, getRetroById, getRetrosByUserId } = require('./retros')
const { getUsers, getUserById } = require('./users')
const SocketServer = require('./socketServer');

express.use(cors())
express.use(morgan('dev'))

express.get('/', (req, res) => {
  res.status(200).send('Welcome to Super Mario World!');
});

express.get('/header', (req, res) => {
  res.json(req.headers)
})

express.get('/users', getUsers)
express.get('/users/:user_id', getUserById)
express.get('/users/:user_id/retros', getRetrosByUserId)

express.get('/retros', getRetros)
express.get('/retros/:retro_id', getRetroById)

new SocketServer(app)

module.exports = { app };