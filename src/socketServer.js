const socketIo = require('socket.io')

module.exports = class SocketServer {
  constructor(server) {
    this.io = socketIo(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.io.on('connection', (socket) => {
      // console.log('io.on', socket)
      // let roomUsers = [
      //   { user_id: "c1ad74ae-b651-4fa0-9820-833193797964", user_name: 'Floyd', is_dark_mode: false },
      //   { user_id: "0e5639ea-8868-4bf6-ab5f-cb8a8d470785", user_name: 'Mario', is_dark_mode: false }]

      socket.on('joinRetro', (payload) => this.joinRetro(socket, payload))
    });
  }

  /**
   * Request from the client to join a room by retro ID
   * @param {string} userId 
   * @param {string} retroId 
   */
  joinRetro(socket, { userId, retroId }) {
    socket.join(retroId);
    console.log('User has joined retro. ', { userId, retroId })
    this.io.to(retroId).emit('joinedRetro', userId)
  }

  broadcastChanges(retroId) {
    // Get entire retro obj from db

    // Broadcast retro obj to room
    this.io.to(retroId).emit('retroUpdated',)
  }
}
