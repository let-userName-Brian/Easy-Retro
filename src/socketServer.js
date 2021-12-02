const socketIo = require('socket.io')
const { fetchRetro } = require('./retros')
const { fetchColumnsByRetroId, fetchColumnById, insertNewColumn, deleteColumn, updateColName, fetchColumnIdByCardId } = require('./columns')
const { fetchCardsByRetroId, fetchCardsByColumnId, fetchCardByCardId, insertNewCard, deleteCard, updateCardText } = require('./cards')
const { fetchCommentsByRetroId, fetchCommentsByCardId, insertComment, deleteComment, updateCommentText } = require('./comments')
const { updateAddVote, updateRemoveVote } = require('./votes')

module.exports = class SocketServer {
  constructor(server) {
    this.retro_id = null
    this.io = socketIo(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });


    // This is called when a client joins the server
    this.io.on('connection', (socket) => {
      this.io.emit('newConnection', socket.id)

      // Establish all connection points that the client may send to the server
      socket.on('joinRetro', async (payload) => await this.joinRetro(socket, payload))

      // Listen for column events from the client
      socket.on('addColumn', ({ retro_id }) => this.addColumn(retro_id))
      socket.on('removeColumn', ({ retro_id, column_id }) => this.removeColumn(retro_id, column_id))
      socket.on('renameColumn', ({ retro_id, column_id, column_name }) => this.renameColumn(retro_id, column_id, column_name))

      // Listen for card events from the client
      socket.on('addCard', ({ retro_id, column_id, user_id }) => this.addCard(column_id, user_id))
      socket.on('removeCard', ({ card_id }) => this.removeCard(card_id))
      socket.on('changeCardText', ({ card_id, card_text }) => this.changeCardText(card_id, card_text))

      // Listen for comment events from the client
      socket.on('addComment', ({ card_id, user_id }) => this.addComment(card_id, user_id))
      socket.on('removeComment', ({ comment_id, card_id }) => this.removeComment(comment_id, card_id))
      socket.on('changeCommentText', ({ comment_id, commentText }) => this.changeCommentText(comment_id, commentText))

      // Listen for vote events from the client
      socket.on('addVote', ({ user_id, card_id, vote_type }) => this.addVote(user_id, card_id, vote_type))
      socket.on('removeVote', ({ user_id, card_id, vote_type }) => this.removeVote(user_id, card_id, vote_type))
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

    // Set our internal retro_id
    this.retro_id = retro_id

    // Send a broadcast to the room that the user has joined
    this.io.to(retro_id).emit('userJoinedRetro', user_id)

    // Send that user the retro objects
    await this.sendRetroToUser(socket, retro_id)
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
    this.io.to(this.retro_id).emit('columnRenamed', { column })
  }

  /**
   * returns a whole column with the whole cards including the author
   * adds card to a column
   * @param {*} retro_id
   * @param {*} column_id
   * @param {*} user_id
   */
  async addCard(column_id, user_id) {
    await insertNewCard(column_id, user_id)
    let cards = await fetchCardsByColumnId(column_id)
    let column = await fetchColumnById(column_id)
    this.cardUpdated(cards, column)
  }

  async removeCard(card_id) {
    console.log('removeCard', card_id)
    let column_id = await fetchColumnIdByCardId(card_id)
    console.log('column_id', column_id)
    await deleteCard(card_id, column_id)
    let newCards = await fetchCardsByColumnId(column_id)
    let column = await fetchColumnById(column_id)
    this.cardUpdated(newCards, column)
  }

  cardUpdated(cards, column) {
    this.io.to(this.retro_id).emit('cardUpdated', { cards, column })
  }

  async changeCardText(card_id, card_text) {
    let card = await updateCardText(card_id, card_text)
    this.io.to(this.retro_id).emit('cardTextUpdated', { card })
  }

  //should be card updated once remove card is refactored
  // cardDeleted(retro_id, cardId) {
  //   this.io.to(retro_id).emit('cardDeleted', cardId)
  // }


  /**
   *
   * @param {*} card_id
   * @param {*} comment_text
   * @param {*} user_id
   */
  async addComment(card_id, user_id) {
    console.log('addComment on: ', card_id, user_id)
    await insertComment(card_id, user_id)
    let comments = await fetchCommentsByCardId(card_id)
    let card = await fetchCardByCardId(card_id)
    this.commentUpdated(card, comments)
  }

  async removeComment(comment_id, card_id) {
    console.log('removeComment', comment_id, card_id)
    await deleteComment(comment_id)
    let comments = await fetchCommentsByCardId(card_id)
    let card = await fetchCardByCardId(card_id)
    this.commentUpdated(card, comments)
  }

  commentUpdated(card, comments) {
    this.io.to(this.retro_id).emit('commentUpdated', { card, comments })
  }

  async changeCommentText(comment_id, comment_text) {
    let comment = await updateCommentText(comment_id, comment_text)
    this.io.to(this.retro_id).emit('commentTextUpdated', { comment })
  }

  async addVote(user_id, card_id, vote_type) {
    await updateAddVote(user_id, card_id, vote_type)
    let newCard = await fetchCardByCardId(card_id)
    let votes = newCard.votes
    this.io.to(this.retro_id).emit('votesChanged', { card_id, votes })
  }

  async removeVote(user_id, card_id, vote_type) {
    await updateRemoveVote(user_id, card_id, vote_type)
    let newCard = await fetchCardByCardId(card_id)
    let votes = newCard.votes
    this.io.to(this.retro_id).emit('votesChanged', { card_id, votes })
  }
}