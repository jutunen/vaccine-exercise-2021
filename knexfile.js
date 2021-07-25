
module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'rokote',
      user:     'rokote',
      password: 'rokote'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }    
  }

};
