const mysql = require('mysql2');

const dbPool = mysql.createPool({
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
})

module.exports = dbPool.promise();
