const bcrypt = require('bcryptjs/dist/bcrypt')
const mysql = require('mysql')
const serverconfig = require('../../config')
const { getUser } = require('../cred_ops')
const sqlPool = require('../main')

function sqlQueryFunction (query) {
  return new Promise((resolve, reject) => {
    sqlPool.getConnection((err, connection) => {
      if (err) {
        console.error(err)
        connection.destroy()
        reject(serverconfig.SERVER_ERROR_REJECT_OBJECT)
      }

      connection.query(query, (err, insert_response) => {
        if (err) {
          console.error(err)
          connection.destroy()
          reject(serverconfig.SERVER_ERROR_REJECT_OBJECT)
        }

        if (insert_response.changedRows > 0) {
          connection.destroy()
          resolve(true)
        } else {
          reject(serverconfig.SERVER_ERROR_REJECT_OBJECT)
        }
      })
    })
  })
}

async function setResearchPaperStatus (email_id, newStatus) {
  let newStatusQuery = `
    UPDATE ?? SET ?? = ? WHERE ?? = ? 
    `
  if (!(newStatus in [0, 1])) {
    return false
  } else {
    newStatusQuery = mysql.format(newStatusQuery, [
      'research_papers',
      'paper_status',
      newStatus,
      'email',
      email_id
    ])
  }

  try {
    const response = await sqlQueryFunction(newStatusQuery)
    return response
  } catch (returned_val) {
    return returned_val
  }
}

async function updatePaperStatus (primary_key, password, newStatus) {
  const success = password === 'adminpassword'
  if (success) {
    const response = await setResearchPaperStatus(primary_key, newStatus)
    return response
  } else {
    throw serverconfig.SERVER_ERROR_REJECT_OBJECT
  }
}

module.exports = { updatePaperStatus }
