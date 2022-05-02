require('dotenv').config()

const dbConfig = {
  connectionLimit: 100,
  // host: 'HOST_NAME_GOES_HERE usually: localhost',
  host: process.env.DB_HOST,
  // user: 'USER_NAME_GOES_HERE usually: root',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
}

module.exports = dbConfig