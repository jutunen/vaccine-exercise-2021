const TABLE_NAME = 'bottle';

exports.seed = function(knex) {
    const ROWS = require('./data/bottles.js');
    return knex(TABLE_NAME).del()
      .then(() => {
        return knex(TABLE_NAME).insert(ROWS);
      })
};
