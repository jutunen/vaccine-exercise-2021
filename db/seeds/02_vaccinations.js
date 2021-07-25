const TABLE_NAME = 'vaccination';

exports.seed = function(knex) {
    const ROWS = require('./data/vaccinations.js');
    return knex(TABLE_NAME).del()
      .then(() => {
        return knex(TABLE_NAME).insert(ROWS);
      })
};
