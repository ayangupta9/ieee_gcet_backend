const mysql = require('mysql')
const fs = require('fs')
// import fetch from 'node-fetch'
const { Blob } = require('buffer')
// const fetch = require('node-fetch')

const {
  dates,
  contacts,
  paperdetails,
  accdetails
} = require('./app/routes/adminEdit')
const path = require('path')

const sqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'AyanGupta2001@!',
  database: 'conference_data'
})

function convertImageToBase64 (path) {
  const buffer = fs.readFileSync(path)
  // const blob = new Blob([buffer])
  const base64String = buffer.toString('base64')
  return base64String
}

class Speaker {
  constructor (name, details, image_path) {
    this.name = name
    this.details = details
    // this.image_path = image_path
    this.image_base64 = convertImageToBase64(image_path)
  }
}

let speaker_details = [
  [
    'Prof. (Dr.) Sri Niwas Singh',
    'Professor (HAG), Department of EE, IIT Kanpur, India / Chairman, India Council, IEEE India.'
  ],
  [
    'Prof. (Dr.) Rajiv Saxena',
    'Vice Chancellor, Jaypee University, Anoopshahr.'
  ],
  [
    'Prof. (Dr.) Deepak Garg',
    'Director leadingindia.ai and Head CSE, Bennett University and Director, NVIDIA-Bennett Centre of Research on AI.'
  ],
  [
    'Prof. (Dr.) Siddhaling Urolagin',
    'Department of Computer Science, Birla Institute of Technology & Science, Pilani, Dubai International Academic City.'
  ],
  [
    'Prof. (Dr.) Celestine Iwendi',
    'School of Creative Technologies, University of Bolton, United Kingdom / Board Member IEEE Sweden Section.'
  ],
  [
    'Prof. (Dr.) Satish K. Singh',
    'IIIT Allahabad / Section Chair, IEEE UP Section.'
  ],
  [
    'Prof. (Dr.) Asheesh K. Singh',
    'Professor EE Department, MNNIT, Allahabad / Immediate Past Section Chair, IEEE UP Section.'
  ],
  [
    'Prof. (Dr.) Prabhakar Tiwari',
    'MMMUT, Gorakhpur/ Secretary, IEEE U.P. Section.'
  ],
  [
    'Prof. (Dr.) Malay Kishore Dutta',
    'Director, Dean PG studies and Research, Dr. A.P.J. Abdul Kalam Technical University, Lucknow.'
  ],
  [
    'Prof. (Dr.) Neetesh Purohit',
    'Indian Institute of Information Technology, Allahabad (IIITA), Prayagraj, UP.'
  ],
  ['Prof. (Dr.) N. Badal', 'Director, REC, Bijnor (U.P.), India.']
]

let speakers = []

images_dir_name = './icac3n_speakers'
const speakerImages = fs.readdirSync(images_dir_name)

for (let i = 1; i <= 11; i++) {
  const image_path = images_dir_name + '/' + `${i}.jpg`
  const speaker = new Speaker(
    speaker_details[i - 1][0],
    speaker_details[i - 1][1],
    image_path
  )
  speakers.push(speaker)
}

speakers = JSON.stringify(speakers)
// console.log(speakers)

// for (let image_name of speakerImages) {
//   // image_path = images_dir_name + '/' + image_name
//   // console.log(image_path)

//   // const image_base64 = convertImageToBase64(image_path)
// }

// console.log(path.parse('));
// convertImageToBase64('./icac3n_speakers/1.jpg')

// const speakers = {}

// // const createTableQuery = `CREATE TABLE events
// //         (
// //             year INT AUTO_INCREMENT,
// //             dates TEXT,
// //             contacts TEXT,
// //             paperdetails TEXT,
// //             accdetails TEXT,
// //             PRIMARY KEY (year)
// //         )`

// // const createPaperTable = `CREATE TABLE research_papers (
// //   paper_id INT AUTO_INCREMENT,
// //   email VARCHAR(255) NOT NULL,
// //   paper_authors TEXT,
// //   paper_title TEXT,
// //   paper_status INT,
// //   year_of_conf INT,
// //   link TEXT,
// //   PRIMARY KEY (paper_id)
// // )`
// // FOREIGN KEY (email) REFERENCES users(email)
// // sqlConnection.connect(function (err) {
// //   if (err) throw err
// //   console.log('Connected!')
// //   sqlConnection.query(createPaperTable, function (err, result) {
// //     if (err) throw err
// //     console.log('Table created')
// //     // console.log('Value inserted')
// //     // console.log('Value updated')
// //     sqlConnection.end()
// //   })
// // })

// let authors = JSON.stringify({ authors: ['ABC', 'BCDE', 'Ayan'] })

// let insertPaperQuery = `
// INSERT INTO research_papers
//   (email,
//   paper_authors,
//   paper_title,
//   paper_status,
//   year_of_conf)
// VALUES (
//   "ayangupta.dev@gmail.com",
//   ?,
//   "Roof detection with Attention Res2Unet",
//   1,
//   2022
// )
// `

let updateSpeakerQuery = `
UPDATE events
SET speakers = ?`

updateSpeakerQuery = mysql.format(updateSpeakerQuery, speakers)

sqlConnection.connect(function (err) {
  if (err) throw err
  console.log('Connected!')
  sqlConnection.query(updateSpeakerQuery, function (err, result) {
    if (err) throw err
    console.log('Value updated')
    sqlConnection.end()
  })
})

// insertPaperQuery = mysql.format(insertPaperQuery, authors)
// // console.log(insertPaperQuery)
