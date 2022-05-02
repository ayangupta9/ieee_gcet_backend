const serverconfig = require('../../config')
const sqlPool = require('../main')

function sqlQueryFunction (query) {
  return new Promise((resolve, reject) => {
    sqlPool.getConnection((err, connection) => {
      if (err) {
        console.error(err)
        connection.destroy()
        reject(serverconfig.SERVER_ERROR_REJECT_OBJECT)
      }

      connection.query(query, (err, response) => {
        if (err) {
          console.error(err)
          connection.destroy()
          reject(serverconfig.SERVER_ERROR_REJECT_OBJECT)
        }

        if (response.length > 0) {
          const data = response[0][Object.keys(response[0])[0]]
          connection.destroy()
          resolve({
            status: 200,
            data: JSON.parse(data)
          })
        } else {
          connection.destroy()
          reject(serverconfig.NOTFOUND_ERROR_REJECT_OBJECT)
        }
      })
    })
  })
}

async function getEventImportantDates () {
  let query = 'select dates from events'
  return await sqlQueryFunction(query)
}

async function getEventContacts () {
  let query = 'select contacts from events'
  return await sqlQueryFunction(query)
}

async function getEventPaperDetails () {
  let query = 'select paperdetails from events'
  return await sqlQueryFunction(query)
}

async function getEventAccountDetails () {
  let query = 'select accdetails from events'
  return await sqlQueryFunction(query)
}

function getSearchedPaper (searchedValue) {
  //   return {
  //     1: 'ABCD',
  //     2: 'EFGH',
  //     3: 'IJKL'
  //   }

  const val = Math.floor(Math.random() * 5) + 1
  let returnval = {}
  for (let index = 0; index < val; index++) {
    returnval[index + 1] = `${index + 1} ${searchedValue}`
  }
  return returnval
}

module.exports = {
  getEventImportantDates,
  getEventContacts,
  getEventPaperDetails,
  getEventAccountDetails,
  getSearchedPaper
}
