const mysql = require('mysql')
const {
  dates,
  contacts,
  paperdetails,
  accdetails
} = require('./app/routes/adminEdit')

const sqlConnection = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: ''
})


// const createTableQuery = `CREATE TABLE events
//         (
//             year INT AUTO_INCREMENT,
//             dates TEXT,
//             contacts TEXT,
//             paperdetails TEXT,
//             accdetails TEXT,
//             PRIMARY KEY (year)
//         )`

sqlConnection.connect(function (err) {
  if (err) throw err
  console.log('Connected!')
  sqlConnection.query(query, function (err, result) {
    if (err) throw err
    // console.log('Value inserted')
    console.log('Value updated')
    sqlConnection.end()
  })
})
