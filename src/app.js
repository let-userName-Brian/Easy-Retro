const express = require('express')();
const app = require('http').createServer(express);
const cors = require('cors')
const { getRetros, getRetroById, getRetrosByUserId } = require('./retros')
const { getUsers } = require('./users')
const SocketServer = require('./socketServer');

express.use(cors())

express.get('/', (req, res) => {
  res.status(200).send('Welcome to Super Mario World!');
});

express.get('/users', getUsers)
express.get('/retros', getRetros)
express.get('/retros/:user_id', getRetrosByUserId)
express.get('/retros/:retro_id', getRetroById)

new SocketServer(app)

module.exports = { app };