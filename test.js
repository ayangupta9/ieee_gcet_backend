const mysql = require('mysql')
const {
  dates,
  contacts,
  paperdetails,
  accdetails
} = require('./app/routes/adminEdit')

const sqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'AyanGupta2001@!',
  database: 'conference_data'
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

// const createPaperTable = `CREATE TABLE research_papers (
//   paper_id INT AUTO_INCREMENT,
//   email VARCHAR(255) NOT NULL,
//   paper_authors TEXT,
//   paper_title TEXT,
//   paper_status INT,
//   year_of_conf INT,
//   link TEXT,
//   PRIMARY KEY (paper_id)
// )`
// FOREIGN KEY (email) REFERENCES users(email)
// sqlConnection.connect(function (err) {
//   if (err) throw err
//   console.log('Connected!')
//   sqlConnection.query(createPaperTable, function (err, result) {
//     if (err) throw err
//     console.log('Table created')
//     // console.log('Value inserted')
//     // console.log('Value updated')
//     sqlConnection.end()
//   })
// })

let authors = JSON.stringify({ authors: ['ABC', 'BCDE', 'Ayan'] })

let insertPaperQuery = `
INSERT INTO research_papers
  (email,
  paper_authors,
  paper_title,
  paper_status,
  year_of_conf)
VALUES (
  "ayangupta.dev@gmail.com",
  ?,
  "Roof detection with Attention Res2Unet",
  1,
  2022
)
`

insertPaperQuery = mysql.format(insertPaperQuery, authors)
// console.log(insertPaperQuery)

sqlConnection.connect(function (err) {
  if (err) throw err
  console.log('Connected!')
  sqlConnection.query(insertPaperQuery, function (err, result) {
    if (err) throw err
    // console.log('Table created')
    console.log('Value inserted')
    // console.log('Value updated')
    sqlConnection.end()
  })
})
