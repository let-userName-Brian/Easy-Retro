const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors')
const morgan = require('morgan')
const { getRetros, getRetroById, getRetrosByUserId, postRetro } = require('./retros')
const { getUsers, getUserById } = require('./users')
const SocketServer = require('./socketServer');

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.status(200).send('Welcome to Super Mario World!');
});

app.get('/header', (req, res) => {
  res.json(req.headers)
})

app.get('/users', getUsers)
app.get('/users/:user_id', getUserById)
app.get('/users/:user_id/retros', getRetrosByUserId)

app.get('/retros', getRetros)
app.post('/retros/create', postRetro)
app.get('/retros/:retro_id', getRetroById)

new SocketServer(server)

module.exports = { server };