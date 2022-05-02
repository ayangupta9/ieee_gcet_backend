const bcrypt = require('bcryptjs/dist/bcrypt')
const sqlPool = require('./main')
const mysql = require('mysql')
const serverconfig = require('../config')
const jsonwebtoken = require('jsonwebtoken')
const hashSalt = 10

async function insertNewUser (user_data) {
  const hashedResult = await bcrypt.hash(user_data.signuppassword, hashSalt)
  let insertQuery = 'INSERT INTO ?? (??,??,??,??) VALUES (?,?,?,?)'
  let query = mysql.format(insertQuery, [
    'users',
    'firstname',
    'lastname',
    'email',
    'hash',
    user_data.firstname,
    user_data.lastname,
    user_data.email,
    hashedResult.toString()
  ])

  return new Promise((resolve, reject) => {
    sqlPool.getConnection(async (err, connection) => {
      if (err) {
        console.error(err)
        connection.release()
        reject(serverconfig.SERVER_ERROR_REJECT_OBJECT)
      }

      connection.query(query, (err, insert_response) => {
        if (err) {
          console.error(err)
          connection.release()
          reject(serverconfig.SERVER_ERROR_REJECT_OBJECT)
        } else {
          connection.destroy()
          //   return resolve(insert_response)
          resolve(true)
        }
      })
    })
  })
}

function checkUserExistsQuery (key) {
  let checkQuery = 'SELECT * FROM ?? WHERE ?? = ?;'
  let query = mysql.format(checkQuery, ['users', 'email', key])

  return new Promise((resolve, reject) => {
    sqlPool.getConnection((err, connection) => {
      if (err) {
        console.log(err)
        connection.release()
        // reject(serverconfig.SERVER_ERROR_REJECT_OBJECT)
        reject(serverconfig.SERVER_ERROR_REJECT_OBJECT)
      }

      connection.query(query, (err, response) => {
        if (err) {
          console.error(err)
          connection.release()
          reject(serverconfig.SERVER_ERROR_REJECT_OBJECT)
        }

        console.log(response)

        if (response.length > 0) {
          connection.release()
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  })
}

function getUser (key) {
  let checkQuery = 'SELECT * FROM ?? WHERE ?? = ?;'
  let query = mysql.format(checkQuery, ['users', 'email', key])

  return new Promise((resolve, reject) => {
    sqlPool.getConnection((err, connection) => {
      if (err) {
        console.error(err)
        connection.destroy()
        reject(serverconfig.SERVER_ERROR_REJECT_OBJECT)
      }

      connection.query(query, (err, response) => {
        if (err) {
          connection.destroy()
          console.error(err)
          reject(serverconfig.SERVER_ERROR_REJECT_OBJECT)
        }

        console.log(response)
        if (response.length === 0) {
          console.error('No such user')
          connection.destroy()
          reject(serverconfig.INVALID_CRED_ERROR_REJECT_OBJECT)
        }

        connection.destroy()
        resolve({
          bool: true,
          status: 200,
          response: response[0]
        })
      })
    })
  })
}

function verifyAccessToken (req, res, next) {
  console.log(req.cookies.accesstoken)
  if (
    !req.cookies.accesstoken ||
    req.cookies.accesstoken === 'undefined' ||
    req.cookies.accesstoken === undefined
  ) {
    res.json({
      status: 401,
      errorMessage: 'Unauthorized. No token found'
    })
  }

  const token = req.cookies.accesstoken

  jsonwebtoken.verify(
    token,
    serverconfig.ACCESS_TOKEN_SECRET,
    (err, payload) => {
      if (err) {
        res.json({
          errorMessage: 'Unauthorized. Verification failed',
          status: 401
        })
        // next()
      }

      req.payload = payload
      if (payload === serverconfig.ADMIN_SECRET_KEY) {
        req.isadmin = true
      }
    }
  )
  next()
}

function signAccessToken (userId) {
  return new Promise((resolve, reject) => {
    const payload = { id: userId }
    const secret = serverconfig.ACCESS_TOKEN_SECRET

    jsonwebtoken.sign(
      payload,
      secret,
      {
        // expiresIn: '1h'
        expiresIn: '15m'
      },
      (err, token) => {
        if (err) return reject(err) // internal server error
        resolve(token)
      }
    )
  })
}

function getUserPapers (email_id) {
  let checkQuery = 'SELECT * FROM ?? WHERE ?? = ?;'
  let query = mysql.format(checkQuery, ['research_papers', 'email', email_id])

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

        if (response.length === 0) {
          console.error('No papers here')
          connection.destroy()
          reject(serverconfig.NO_PAPERS_ERROR_REJECT_OBJECT)
        }

        connection.destroy()
        resolve(response)
      })
    })
  })
}

module.exports = {
  insertNewUser,
  checkUserExistsQuery,
  getUser,
  signAccessToken,
  verifyAccessToken,
  getUserPapers
}
