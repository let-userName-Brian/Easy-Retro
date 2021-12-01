const { knex } = require('./knexConnector')

async function updateAddVote(user_id, card_id, vote_type) {
  // return await knex.transaction(async (t) => {
  //   return await t('card')
  //     .select('votes')
  //     .then(async (new_column_id) => knex('retro')
  //       .where({ retro_id })
  //       // .update('column_ids', knex.raw('column_ids || ?', [new_column_id]), 'column_ids'))
  //       .update('column_ids', knex.raw('array_cat(column_ids, ?)', [new_column_id]), 'column_ids'))
  // })
}

async function updateRemoveVote() {

}

module.exports = { updateAddVote, updateRemoveVote }