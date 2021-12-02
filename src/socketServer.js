const socketIo = require('socket.io')
const { fetchRetro } = require('./retros')
const { fetchColumnsByRetroId, fetchColumnById, insertNewColumn, deleteColumn, updateColName, fetchColumnIdByCardId } = require('./columns')
const { fetchCardsByRetroId, fetchCardsByColumnId, fetchCardByCardId, insertNewCard, deleteCard, updateCardText } = require('./cards')
const { fetchCommentsByRetroId, fetchCommentsByCardId, insertComment, deleteComment, updateCommentText } = require('./comments')
const { updateAddVote, updateRemoveVote } = require('./votes')

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
      this.io.emit('newConnection', socket.id)

      let retro_id = null

      // Establish all connection points that the client may send to the server
      socket.on('joinRetro', async (payload) => retro_id = await this.joinRetro(socket, payload))

      // Listen for column events from the client
      socket.on('addColumn', ({ }) => this.addColumn(retro_id))
      socket.on('removeColumn', ({ column_id }) => this.removeColumn(retro_id, column_id))
      socket.on('renameColumn', ({ column_id, column_name }) => this.renameColumn(retro_id, column_id, column_name))

      // Listen for card events from the client
      socket.on('addCard', ({ column_id, user_id }) => this.addCard(retro_id, column_id, user_id))
      socket.on('removeCard', ({ card_id }) => this.removeCard(retro_id, card_id))
      socket.on('changeCardText', ({ card_id, card_text }) => this.changeCardText(retro_id, card_id, card_text))

      // Listen for comment events from the client
      socket.on('addComment', ({ card_id, user_id }) => this.addComment(retro_id, card_id, user_id))
      socket.on('removeComment', ({ comment_id, card_id }) => this.removeComment(retro_id, comment_id, card_id))
      socket.on('changeCommentText', ({ comment_id, commentText }) => this.changeCommentText(retro_id, comment_id, commentText))

      // Listen for vote events from the client
      socket.on('addVote', ({ user_id, card_id, vote_type }) => this.addVote(retro_id, user_id, card_id, vote_type))
      socket.on('removeVote', ({ user_id, card_id, vote_type }) => this.removeVote(retro_id, user_id, card_id, vote_type))
    });
  }

  /**
   * Request from the client to join a room by retro ID
   * @param {string} user_id
   * @param {string} retro_id
   */
  async joinRetro(socket, { user_id, retro_id }) {
    // Put the client into a room with the same name as the retro id
    socket.join(retro_id);
    console.log('User has joined retro. ', { user_id, retro_id })

    // Send a broadcast to the room that the user has joined
    this.io.to(retro_id).emit('userJoinedRetro', user_id)

    // Send that user the retro objects
    await this.sendRetroToUser(socket, retro_id)

    return retro_id
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

  /**
   * insert new column
   * @param {*} retro_id
   */
  async addColumn(retro_id) {
    await insertNewColumn(retro_id)
    let newColumns = await fetchColumnsByRetroId(retro_id)
    this.columnUpdated(retro_id, newColumns)
  }

  async removeColumn(retro_id, column_id) {
    await deleteColumn(retro_id, column_id)
    let newColumns = await fetchColumnsByRetroId(retro_id)
    this.columnUpdated(retro_id, newColumns)
  }

  async columnUpdated(retro_id, columns) {
    let retro = await fetchRetro(retro_id)
    this.io.to(retro_id).emit('columnUpdated', { retro, columns })
  }

  async renameColumn(retro_id, column_id, newName) {
    let column = await updateColName(column_id, newName)
    this.io.to(retro_id).emit('columnRenamed', { column })
  }

  /**
   * returns a whole column with the whole cards including the author
   * adds card to a column
   * @param {*} retro_id
   * @param {*} column_id
   * @param {*} user_id
   */
  async addCard(retro_id, column_id, user_id) {
    // console.log('addCard', retro_id, column_id, user_id)
    let card_id = await insertNewCard(column_id, user_id)
    // console.log('card_id', card_id)
    let cards = await fetchCardsByColumnId(column_id)
    let column = await fetchColumnById(column_id)
    this.cardUpdated(retro_id, cards, column, user_id, card_id)
  }

  async removeCard(retro_id, card_id) {
    // console.log('removeCard', card_id)
    let column_id = await fetchColumnIdByCardId(card_id)
    // console.log('column_id', column_id)
    await deleteCard(card_id, column_id)
    let newCards = await fetchCardsByColumnId(column_id)
    let column = await fetchColumnById(column_id)
    this.cardUpdated(retro_id, newCards, column, null, card_id)
  }

  cardUpdated(retro_id, cards, column, user_id, card_id) {
    this.io.to(retro_id).emit('cardUpdated', { cards, column, user_id, card_id })
  }

  async changeCardText(retro_id, card_id, card_text) {
    let card = await updateCardText(card_id, card_text)
    this.io.to(retro_id).emit('cardTextUpdated', { card })
  }

  /**
   *
   * @param {*} card_id
   * @param {*} comment_text
   * @param {*} user_id
   */
  async addComment(retro_id, card_id, user_id) {
    console.log('addComment on: ', card_id, user_id)
    await insertComment(card_id, user_id)
    let comments = await fetchCommentsByCardId(card_id)
    let card = await fetchCardByCardId(card_id)
    this.commentUpdated(retro_id, card, comments)
  }

  async removeComment(retro_id, comment_id, card_id) {
    console.log('removeComment', comment_id, card_id)
    await deleteComment(comment_id)
    let comments = await fetchCommentsByCardId(card_id)
    let card = await fetchCardByCardId(card_id)
    this.commentUpdated(retro_id, card, comments)
  }

  commentUpdated(retro_id, card, comments) {
    this.io.to(retro_id).emit('commentUpdated', { card, comments })
  }

  async changeCommentText(retro_id, comment_id, comment_text) {
    let comment = await updateCommentText(comment_id, comment_text)
    this.io.to(retro_id).emit('commentTextUpdated', { comment })
  }

  async addVote(retro_id, user_id, card_id, vote_type) {
    await updateAddVote(user_id, card_id, vote_type)
    let newCard = await fetchCardByCardId(card_id)
    let votes = newCard.votes
    this.io.to(retro_id).emit('votesChanged', { card_id, votes })
  }

  async removeVote(retro_id, user_id, card_id, vote_type) {
    await updateRemoveVote(user_id, card_id, vote_type)
    let newCard = await fetchCardByCardId(card_id)
    let votes = newCard.votes
    this.io.to(retro_id).emit('votesChanged', { card_id, votes })
  }
}