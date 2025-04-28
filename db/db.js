const { Pool } = require('pg');
const { DB_HOST, DB_USER, DB_PASWORD, DB_NAME, DB_PORT } = require('../config.js')

const PostgreSQL = new Pool ({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASWORD,
    port: DB_PORT,
})

module.exports = PostgreSQL