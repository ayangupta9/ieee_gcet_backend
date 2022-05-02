const mysql = require('mysql')
const serverconfig = require('../../config')
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
        console.error(err)
        connection.destroy()
        reject(serverconfig.SERVER_ERROR_REJECT_OBJECT)
      }

      connection.query(query, async (err, insert_response) => {
        if (err) {
          console.error(err)
          connection.destroy()
          reject(serverconfig.SERVER_ERROR_REJECT_OBJECT)
        }

        if (insert_response.changedRows > 0) {
          console.log(insert_response)
          resolve()
        } else {
          reject(serverconfig.SERVER_ERROR_REJECT_OBJECT)
        }
      })
    })
  })
}

async function setEventImportantDates (newdates) {
  let query = 'update ?? set ?? = ?'
  query = mysql.format(query, ['events', 'dates', JSON.stringify(newdates)])
  try {
    await sqlQueryFunction(query)
    return await getEventImportantDates()
  } catch (returned_val) {
    return returned_val
  }
  //   console.log(query)
}
async function setEventContacts (newcontacts) {
  let query = 'update ?? set ?? = ?'
  query = mysql.format(query, [
    'events',
    'contacts',
    JSON.stringify(newcontacts)
  ])
  try {
    await sqlQueryFunction(query)
    return await getEventContacts()
  } catch (returned_val) {
    return returned_val
  }
  //   console.log(query)
}
async function setEventPaperDetails (newpaperdetails) {
  let query = 'update ?? set ?? = ?'
  query = mysql.format(query, [
    'events',
    'paperdetails',
    JSON.stringify(newpaperdetails)
  ])

  try {
    await sqlQueryFunction(query)
    return await getEventPaperDetails()
  } catch (returned_val) {
    return returned_val
  }
}
async function setEventAccountDetails (newaccdetails) {
  let query = 'update ?? set ?? = ?'
  query = mysql.format(query, [
    'events',
    'accdetails',
    JSON.stringify(newaccdetails)
  ])

  try {
    await sqlQueryFunction(query)
    return await getEventAccountDetails()
  } catch (returned_val) {
    return returned_val
  }
}

module.exports = {
  setEventImportantDates,
  setEventContacts,
  setEventPaperDetails,
  setEventAccountDetails
}
