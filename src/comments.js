const { knex } = require('./knexConnector')
const { fetchCardIdsByRetroId } = require('./cards')

async function fetchCommentsByRetroId(retro_id) {
  let card_ids = await fetchCardIdsByRetroId(retro_id)

  return knex('comment')
    .join('user_profile', 'comment.user_id', '=', 'user_profile.user_id')
    .whereIn('card_id', card_ids)
    .select('comment.*', 'user_profile.user_name')
    .orderBy('comment_id')
}

async function fetchCommentsByCardId(card_id) {
  return await knex('comment')
    .join('user_profile', 'comment.user_id', '=', 'user_profile.user_id')
    .where({ card_id })
    .select('comment.*', 'user_profile.user_name')
    .orderBy('comment_id')
}

async function insertComment(card_id, user_id) {
  return await knex('comment')
    .insert({ card_id, comment_text: 'New Comment', user_id }, 'comment_id')
    .then(comments => comments[0])
}

async function deleteComment(comment_id) {
  return await knex('comment')
    .where({ comment_id })
    .delete()
}

async function updateCommentText(comment_id, comment_text) {
  return await knex('comment')
    .where({ comment_id })
    .update({ comment_text }, '*')
    .then(comment => comment[0])
}

module.exports = { fetchCommentsByRetroId, fetchCommentsByCardId, insertComment, deleteComment, updateCommentText }