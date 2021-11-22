const socketIo = require('socket.io')
const { fetchRetro } = require('./retros')
const { fetchColumnsByRetroId } = require('./columns')
const { fetchCardsByRetroId } = require('./cards')
const { fetchCommentsByRetroId } = require('./comments')


module.exports = class SocketServer {
  constructor(server) {
    this.io = socketIo(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    // This is called when a client joins the server
    this.io.on('connection', (socket) => {
      // Establish all connection points that the client may send to the server
      socket.on('joinRetro', (payload) => this.joinRetro(socket, payload))
    });
  }

  /**
   * Request from the client to join a room by retro ID
   * @param {string} userId 
   * @param {string} retroId 
   */
  joinRetro(socket, { userId, retroId }) {
    // Put the client into a room with the same name as the retro id
    socket.join(retroId);
    console.log('User has joined retro. ', { userId, retroId })

    // Send a broadcast to the room that the user has joined
    this.io.to(retroId).emit('userJoinedRetro', userId)

    // Send that user the retro objects
    this.sendRetroToUser(socket, userId, retroId)
  }

  /**
   * Sends entire retro payload to the room
   * @param {string} retro_id 
   */
  async sendRetroToUser(socket, retro_id) {
    // Get entire retro obj from db
    let retro = await fetchRetro(retro_id)
    let columns = await fetchColumnsByRetroId(retro_id)
    let cards = await fetchCardsByRetroId(column.column_id)
    let comments = await fetchCommentsByRetroId(card.card_id)

    socket.emit('fetchedRetro', retro)
    socket.emit('fetchedCards', cards)
    socket.emit('fetchedColumns', columns)
    socket.emit('fetchedComments', comments)
  }

  columnAdded(retro_id, column) {
    this.io.to(retro_id).emit('columnAdded', column)
  }

  columnUpdated(retro_id, column) {
    this.io.to(retro_id).emit('columnUpdated', column)
  }

  columnDeleted(retro_id, columnId) {
    this.io.to(retro_id).emit('columnDeleted', columnId)
  }

  cardAdded(retro_id, card) {
    this.io.to(retro_id).emit('cardAdded', card)
  }

  cardUpdated(retro_id, card) {
    this.io.to(retro_id).emit('cardUpdated', card)
  }

  cardDeleted(retro_id, cardId) {
    this.io.to(retro_id).emit('cardDeleted', cardId)
  }

  commentAdded(retro_id, comment) {
    this.io.to(retro_id).emit('commentAdded', comment)
  }

  commentUpdated(retro_id, comment) {
    this.io.to(retro_id).emit('commentUpdated', comment)
  }

  commentDeleted(retro_id, commentId) {
    this.io.to(retro_id).emit('commentDeleted', commentId)
  }
}
