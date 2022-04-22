const express = require('express')
const cors = require('cors')
const cookieSession = require('cookie-session')
const res = require('express/lib/response')
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const { saveJsonContent, readJsonFileValue } = require('./app/readJsonFile')
const {
  dates,
  contacts,
  paperdetails,
  accdetails,
  adminEditRouter
} = require('./app/routes/adminEdit')
const sqlPool = require('./app/db/main')

const app = express()
const PORT = process.env.PORT || 8080
const hashSalt = 10

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: false
  })
)
app.use(
  cookieSession({
    name: 'ieee_gcet',
    secret: 'IEEE_GCET',
    httpOnly: true,
    maxAge: 1000 * 60 * 15,
    secure: true
  })
)

app.use('/admin', adminEditRouter)

const ADMIN_SECRET_KEY = 'admin@admin.com'
const ACCESS_TOKEN_SECRET = 'accesstokensecret'
const REFRESH_TOKEN_SECRET = 'refreshtokensecret'

function verifyAccessToken (req, res, next) {
  if (!req.cookies.accesstoken || req.cookies.accesstoken === 'undefined') {
    return res.status(401).json({ error: 'Unauthorized. No token found' })
  }

  const token = req.cookies.accesstoken

  jsonwebtoken.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res
        .status(401)
        .json({ error: 'Unauthorized. Verification failed' })
    }

    req.payload = payload
    if (payload === ADMIN_SECRET_KEY) {
      req.isadmin = true
    }
  })
  next()
}

function signAccessToken (userId) {
  return new Promise((resolve, reject) => {
    const payload = { id: userId }
    const secret = ACCESS_TOKEN_SECRET

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

// function signRefreshToken (userId) {
//   return new Promise((resolve, reject) => {
//     const payload = { id: userId }
//     const secret = REFRESH_TOKEN_SECRET

//     jsonwebtoken.sign(
//       payload,
//       secret,
//       {
//         expiresIn: '1y'
//         // expiresIn: '1m'
//       },
//       (err, token) => {
//         if (err) reject(err) // internal server error
//         resolve(token)
//       }
//     )
//   })
// }

function errorHandler (res, errorCode, message) {
  res.status(errorCode).json({
    message: message
  })
}

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
        // errorHandler(res, 500, 'Encountered Error! Try again later.')
        connection.release()
        return reject(err)
      }

      connection.query(query, (err, insert_response) => {
        if (err) {
          // errorHandler(res, 500, 'Encountered Error!')
          connection.release()
          return reject(err)
        } else {
          // res.status(200).json({
          //   message: 'User Registered!'
          // })
          connection.release()
          return resolve(insert_response)
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
        return reject(err)
      }

      connection.query(query, (err, response) => {
        if (err) {
          console.log('126', err)
          connection.release()
          return reject(err)
        }

        console.log(response)

        if (response.length > 0) {
          // console.log(new Error('User already exists'))
          connection.release()
          resolve(true)
        } else {
          resolve(false)
        }

        // console.log(response[0])
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
        console.log(err)
        connection.release()
        return reject(err)
      }

      connection.query(query, (err, response) => {
        if (err) {
          console.log('126', err)
          connection.release()
          return reject(err)
        }

        if (response.length === 0) {
          console.log(new Error('User does not exist'))
          connection.release()
          return reject(new Error('User does not exist'))
        }

        // console.log(response[0])
        resolve(response[0])
      })
    })
  })
}

app.post('/test', async (req, res) => {
  const key = req.body.id
  const accessToken = await signAccessToken(key)
  res.cookie('accesstoken', accessToken, {
    maxAge: 1000 * 60 * 60,
    httpOnly: true
  })
  res.send({ accessToken: accessToken })
})

app.get('/testsend', async (req, res) => {
  // console.log(Object.keys(req.cookies))
  res.status(200).json({
    message: Object.keys(req.cookies).toString()
  })
})

app.get('/checkuser', (req, res) => {
  if (req.cookies.accesstoken) {
    jsonwebtoken.verify(
      req.cookies.accesstoken,
      ACCESS_TOKEN_SECRET,
      async (err, payload) => {
        // console.log(payload)
        const user = await getUser(payload.id)
        // console.log(user)
        res.json({ isloggedin: true })
      }
    )
  } else {
    res.json({ isloggedin: false })
  }
})

app.get('/profile', verifyAccessToken, async (req, res) => {
  const payload = req.payload

  // console.log(payload)

  if (payload.id === ADMIN_SECRET_KEY) {
    const user = {
      firstname: 'admin',
      lastname: 'admin',
      email: payload.id,
      user_id: -1,
      isadmin: true
    }

    res.status(200).json({ user })
  } else {
    try {
      const user = await getUser(payload.id)
      // console.log(user)
      return res.status(200).json({
        user
      })
    } catch (err) {
      return res.status(500).json({
        message: err
      })
    }
  }
})

app.post('/signup', async (req, res) => {
  const user_info = req.body
  const key = user_info.email

  // const user = await getUser(key)

  if (key === ADMIN_SECRET_KEY) {
    res.status(401).json({
      error: 'Unauthorized access'
    })
  } else {
    const userExists = await checkUserExistsQuery(key)

    if (userExists === false) {
      try {
        console.log(user_info)
        const insert_response = await insertNewUser(user_info)
        res.status(200).json({
          message: 'User registered!'
        })
      } catch (err) {
        console.error(err)
        res.status(500).json({
          message: 'Internal server error 282'
        })
      }
    } else {
      res.status(401).json({
        message: 'User already exists!'
      })
    }
  }
})

app.post('/login', async (req, res) => {
  const user_info = req.body.data
  const key = user_info.email

  // console.log(key === ADMIN_SECRET_KEY)
  if (key === ADMIN_SECRET_KEY) {
    const success = user_info.password === 'adminpassword'
    if (success) {
      const accesstoken = await signAccessToken(key)
      // console.log(accesstoken)

      res.cookie('accesstoken', accesstoken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
      })
      res.status(200).json({
        data: {
          // userdata: user,
          isloggedin: true
          // accessToken: accesstoken
        }
      })
    } else {
      res.status(403).json({ message: 'Unauthorized access' })
    }
  } else {
    try {
      const user = await getUser(key)
      const success = await bcrypt.compare(user_info.password, user.hash)
      if (!success) {
        errorHandler(res, 403, 'Incorrect Password')
        connection.release()
        return
      } else {
        const accessToken = await signAccessToken(key)
        res.cookie('accesstoken', accessToken, {
          httpOnly: true,
          // maxAge: 1000 * 60 * 60
          maxAge: 1000 * 60
        })
        res.status(200).json({
          data: {
            isloggedin: true
            // accessToken: accessToken
          }
        })
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
})

app.get('/logout', verifyAccessToken, (req, res) => {
  res.cookie('accesstoken', '', {
    maxAge: 0
  })
  res.status(200).json({ code: 200, message: 'logged out' })
})

let WEBSITE_COUNT = 0

app.get('/websitecount', async (req, res) => {
  WEBSITE_COUNT += 1
  console.log('Website count: ', WEBSITE_COUNT)
  res.json({
    visited: WEBSITE_COUNT
  })
})

app.listen(PORT, () => {
  console.log('Listening at 8080...')
  // console.log(JSON.stringify(dates))
  // , contacts, paperdetails, accdetails
  // sqlPool.getConnection((err, connection) => {
  //   if (err) {
  //     console.log('err')
  //   } else {
  //     console.log('SQL connected')
  //   }
  //   connection.release()
  // })
})
