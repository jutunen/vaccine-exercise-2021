
exports.seed = function(knex) {
    return knex.raw("update bottle set expired = arrived + interval '30 days';")
};
