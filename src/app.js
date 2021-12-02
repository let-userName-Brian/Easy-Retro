const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors')
const morgan = require('morgan')
const { getRetros, getRetroById, getRetrosByUserId, postRetro, deleteRetroById } = require('./retros')
const { getUsers, getUserById, login } = require('./users')
const jwt = require('jsonwebtoken');
const SocketServer = require('./socketServer');

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.status(200).send('Welcome to Super Mario World! \nThis is the backend u dummy! Go to localhost:3000!');
});

app.get('/header', (req, res) => {
  let token = jwt.decode(req.headers.jwt)
  res.json(token)
})

app.get('/login', login)

app.get('/users', getUsers)
app.get('/users/:user_id', getUserById)
app.get('/users/:user_id/retros', getRetrosByUserId)

app.get('/retros', getRetros)
app.post('/retros/create/:user_id', postRetro)
app.get('/retros/:retro_id', getRetroById)
app.delete('/retros/delete/:retro_id', deleteRetroById)

new SocketServer(server)

module.exports = { server };