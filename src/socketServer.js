const socketIo = require('socket.io')
const { fetchRetro } = require('./retros')
const { fetchColumnsByRetroId, insertNewColumn, fetchColumnById } = require('./columns')
const { fetchCardsByRetroId, fetchCardsByColId, insertNewCard } = require('./cards')
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
      console.log('New connection from', socket.id, socket.conn)
      this.io.emit('newConnection', socket.id)
      // Establish all connection points that the client may send to the server
      socket.on('joinRetro', async (payload) => await this.joinRetro(socket, payload))
      socket.on('columnAdded', (retro_id) => this.columnAdded(retro_id))
      socket.on('cardAdded', ({ retro_id, column_id, userId }) => this.cardAdded(retro_id, column_id, userId))
    });
  }

  /**
   * Request from the client to join a room by retro ID
   * @param {string} userId
   * @param {string} retroId
   */
  async joinRetro(socket, { userId, retroId }) {
    // Put the client into a room with the same name as the retro id
    socket.join(retroId);
    console.log('User has joined retro. ', { userId, retroId })

    // Send a broadcast to the room that the user has joined
    this.io.to(retroId).emit('userJoinedRetro', userId)

    // Send that user the retro objects
    await this.sendRetroToUser(socket, retroId)
  }

  /**
   * Sends entire retro payload to the room
   * @param {*} socket the socket connection
   * @param {string} retro_id the retro UUID
   */
  async sendRetroToUser(socket, retro_id) {
    console.log('Sending retro to user')
    let retro = await fetchRetro(retro_id)
    let columns = await fetchColumnsByRetroId(retro_id)
    let cards = await fetchCardsByRetroId(retro_id)
    let comments = await fetchCommentsByRetroId(retro_id)

    socket.emit('initRetro', { retro, columns, cards, comments })
  }

  async columnAdded(retro_id) {
    let newColumnIds = await insertNewColumn(retro_id)
    let newColumns = await fetchColumnsByRetroId(retro_id)
    this.columnUpdated(retro_id, newColumns, newColumnIds[0])
  }

  columnUpdated(retro_id, columns, column_ids) {
    this.io.to(retro_id).emit('columnUpdated', { columns, column_ids })
  }

  columnDeleted(retro_id, cardId) {
    this.io.to(retro_id).emit('cardDeleted', cardId)
  }
  /**
   * adds card to a column
   * @param {*} retro_id
   * @param {*} column_id
   * @param {*} user_id
   */
  async cardAdded(retro_id, column_id, user_id) {
    await insertNewCard(column_id, user_id)
    let cards = await fetchCardsByColId(column_id)
    this.cardUpdated(retro_id, cards, column_id)
  }

  /**
   * all cols cards
   * @param {*} retro_id
   * @param {*} cards
   */
  cardUpdated(retro_id, cards, column_id) {
    this.io.to(retro_id).emit('cardUpdated', { cards, column_id })
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
