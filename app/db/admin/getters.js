const serverconfig = require('../../config')
const sqlPool = require('../main')

function sqlQueryFunction (query) {
  return new Promise((resolve, reject) => {
    sqlPool.getConnection((err, connection) => {
      if (err) {
        connection.destroy()
        reject(serverconfig.SERVER_ERROR_REJECT_OBJECT)
      }

      connection.query(query, (err, response) => {
        if (err) {
          connection.destroy()
          reject(serverconfig.SERVER_ERROR_REJECT_OBJECT)
        }

        if (response !== null && response !== undefined && response.length > 0) {
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

async function getEventSpeakersDetails () {
  let query = 'select speakers from events'
  return await sqlQueryFunction(query)
}

async function getEventOrgCommitteeDetails () {
  let query = 'select org_committee from events'
  return await sqlQueryFunction(query)
}

async function getEventTechPrgCommitteeDetails () {
  let query = 'select tech_prg_committee from events'
  return await sqlQueryFunction(query)
}

async function getEventAdvisoryBoardDetails () {
  let query = 'select adv_board from events'
  return await sqlQueryFunction(query)
}

module.exports = {
  getEventImportantDates,
  getEventContacts,
  getEventPaperDetails,
  getEventAccountDetails,
  getEventSpeakersDetails,
  getEventOrgCommitteeDetails,
  getEventTechPrgCommitteeDetails,
  getEventAdvisoryBoardDetails
}

// function getSearchedPaper (searchedValue) {
//   const val = Math.floor(Math.random() * 5) + 1
//   let returnval = {}
//   for (let index = 0; index < val; index++) {
//     returnval[index + 1] = `${index + 1} ${searchedValue}`
//   }
//   return returnval
// }
