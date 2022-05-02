const mysql = require('mysql')
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
          connection.destroy()
          resolve(response)
        } else {
          connection.destroy()
          reject(serverconfig.NO_PAPERS_ERROR_REJECT_OBJECT)
        }
      })
    })
  })
}

async function getResearchPaperByQuery (searchQuery) {
  let query = `SELECT * FROM ?? 
  WHERE ?? LIKE "%${searchQuery}%" OR 
  ?? LIKE "%${searchQuery}%" OR 
  ?? LIKE "%${searchQuery}%" OR 
  ?? LIKE "%${searchQuery}%"`

  query = mysql.format(query, [
    'research_papers',
    'email',
    'paper_authors',
    'paper_id',
    'paper_title'
  ])

  return await sqlQueryFunction(query)
}

module.exports = { getResearchPaperByQuery }
