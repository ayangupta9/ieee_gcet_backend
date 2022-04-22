const mysql = require('mysql')
const dbConfig = require('./dbConfig')
const sqlPool = mysql.createPool(dbConfig)

module.exports = sqlPool
