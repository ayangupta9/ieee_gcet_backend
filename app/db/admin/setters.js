const mysql = require('mysql')
const sqlPool = require('../main')
const {
  getEventImportantDates,
  getEventContacts,
  getEventPaperDetails,
  getEventAccountDetails
} = require('./getters')

function sqlQueryFunction (query) {
  return new Promise((resolve, reject) => {
    sqlPool.getConnection((err, connection) => {
      if (err) {
        connection.release()
        reject(err)
      }

      connection.query(query, async (err, insert_response) => {
        if (err) {
          connection.release()
          reject(err)
        }

        console.log(insert_response)
        resolve()
      })
    })
  })
}

async function setEventImportantDates (newdates) {
  let query = 'update ?? set ?? = ?'
  query = mysql.format(query, ['events', 'dates', JSON.stringify(newdates)])
  await sqlQueryFunction(query)
  return await getEventImportantDates()
  //   console.log(query)
}
async function setEventContacts (newcontacts) {
  let query = 'update ?? set ?? = ?'
  query = mysql.format(query, [
    'events',
    'contacts',
    JSON.stringify(newcontacts)
  ])
  await sqlQueryFunction(query)
  return await getEventContacts()
  //   console.log(query)
}
async function setEventPaperDetails (newpaperdetails) {
  let query = 'update ?? set ?? = ?'
  query = mysql.format(query, [
    'events',
    'paperdetails',
    JSON.stringify(newpaperdetails)
  ])
  await sqlQueryFunction(query)
  return await getEventPaperDetails()
}
async function setEventAccountDetails (newaccdetails) {
  let query = 'update ?? set ?? = ?'
  query = mysql.format(query, [
    'events',
    'accdetails',
    JSON.stringify(newaccdetails)
  ])
  await sqlQueryFunction(query)
  return await getEventAccountDetails()
}

module.exports = {
  setEventImportantDates,
  setEventContacts,
  setEventPaperDetails,
  setEventAccountDetails
}
