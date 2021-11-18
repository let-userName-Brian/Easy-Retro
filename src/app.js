const express = require('express');
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV || 'development']);
const app = express();
const port = 8080;
const server = require('http').createServer(app);
const cors = require('cors')
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


app.use(cors())

io.on('connection', (socket) => {
  // console.log('io.on', socket)
  let roomUsers = [
    { user_id: "c1ad74ae-b651-4fa0-9820-833193797964", user_name: 'Floyd', is_dark_mode: false },
    { user_id: "0e5639ea-8868-4bf6-ab5f-cb8a8d470785", user_name: 'Mario', is_dark_mode: false }]
  socket.on('joinedRetro', ({ userId, retroId }) => {
    console.log('User has joined retro. ', {userId, retroId})
    socket.join(retroId);
    io.to(retroId).emit('joinedRetro', roomUsers)
  })
});

app.get('/', (req, res) => {
  res.status(200).send('Welcome to Super Mario World!');
});

app.get('/users', (req, res) => {
  getAllUsers().then(data => res.json(data))
})

function getAllUsers() {
  return knex.select('*').from('user')
}

server.listen(port, () => {
  console.log(`Dropping the hammer on port:${port}`);
})

module.exports = server;