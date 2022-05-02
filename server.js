const express = require('express')
const cors = require('cors')
const cookieSession = require('cookie-session')
const res = require('express/lib/response')
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const mysql = require('mysql')

// const { saveJsonContent, readJsonFileValue } = require('./app/readJsonFile')
const { adminEditRouter } = require('./app/routes/adminEdit')
// const sqlPool = require('./app/db/main')

const {
  insertNewUser,
  checkUserExistsQuery,
  getUser,
  signAccessToken,
  verifyAccessToken,
  getUserPapers
} = require('./app/db/cred_ops')

const serverconfig = require('./app/config')

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: false
  })
)

// app.use(
//   cookieSession({
//     name: 'ieee_gcet',
//     secret: 'IEEE_GCET',
//     httpOnly: true,
//     maxAge: 1000 * 60 * 15,
//     secure: true
//   })
// )

app.use('/admin', adminEditRouter)

function errorHandler (res, errorCode, message) {
  res.status(errorCode).json({
    message: message
  })
}

app.get('/checkuser', verifyAccessToken, async (req, res) => {
  const payload = req.payload

  if (payload && payload.id === serverconfig.ADMIN_SECRET_KEY) {
    user = {
      firstname: 'admin',
      lastname: 'admin',
      email: payload.id,
      user_id: -1,
      isadmin: true
    }
    // if (payload && payload.id !== serverconfig.ADMIN_SECRET_KEY)
  } else {
    try {
      let userExists = await checkUserExistsQuery(payload.id)
      if (userExists.status === 200) {
        res.json({ isloggedin: true })
      }
    } catch (returned_val) {
      res.json({
        status: returned_val.status,
        errorMessage: returned_val.errorMessage
      })
    }
  }
  // console.log(user)

  // if (req.cookies.accesstoken) {
  //   jsonwebtoken.verify(
  //     req.cookies.accesstoken,
  //     serverconfig.ACCESS_TOKEN_SECRET,
  //     async (err, payload) => {
  //       if (err) {
  //         console.error(err)
  //         return
  //       }

  //       console.log(payload)
  //       let user = null

  //     }
  //   )
  // } else {
  //   res.json({ isloggedin: false })
  // }
})

app.get('/checkadmin', verifyAccessToken, (req, res) => {
  const payload = req.payload
  if (payload.id === serverconfig.ADMIN_SECRET_KEY) {
    res.json({
      status: 200
    })
  } else {
    res.json({
      status: 403
    })
  }
})

app.get('/profile', verifyAccessToken, async (req, res) => {
  const payload = req.payload
  if (payload.id === serverconfig.ADMIN_SECRET_KEY) {
    const user = {
      firstname: 'admin',
      lastname: 'admin',
      email: payload.id,
      user_id: -1,
      isadmin: true
    }

    res.json({
      status: 200,
      user: user
    })
  } else {
    try {
      const user = await getUser(payload.id)
      res.json({
        status: 200,
        user: user
      })
    } catch (returned_val) {
      res.json({
        status: returned_val.status,
        errorMessage: returned_val.errorMessage
      })
    }
  }
})

app.post('/signup', async (req, res) => {
  const user_info = req.body
  const key = user_info.email

  if (key === serverconfig.ADMIN_SECRET_KEY) {
    res.json({
      status: 403,
      errorMessage: 'Unauthorized access'
    })
  } else {
    try {
      const userExists = await checkUserExistsQuery(key)
      if (userExists === false) {
        try {
          console.log(user_info)
          const insert_response = await insertNewUser(user_info)
          if (insert_response) {
            res.json({
              status: 200,
              errorMessage: 'User registered!'
            })
          }
        } catch (returned_val) {
          console.error(returned_val)
          res.json({
            status: returned_val.status,
            errorMessage: returned_val.errorMessage
          })
        }
      } else {
        res.json({
          status: 401,
          errorMessage: 'User already exists!'
        })
      }
    } catch (returned_val) {
      console.error(returned_val)
      res.json({
        status: returned_val.status,
        errorMessage: returned_val.errorMessage
      })
    }
  }
})

app.post('/login', async (req, res) => {
  const user_info = req.body.data
  const key = user_info.email

  if (key === serverconfig.ADMIN_SECRET_KEY) {
    const success = user_info.password === 'adminpassword'
    if (success) {
      const accesstoken = await signAccessToken(key)
      console.log(accesstoken)

      res.cookie('accesstoken', accesstoken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 15
      })
      res.json({
        data: {
          status: 200,
          // userdata: user,
          isloggedin: true
          // accessToken: accesstoken
        }
      })
    } else {
      res.json({
        status: 403,
        errorMessage: 'Incorrect username/password'
      })
    }
  } else {
    try {
      const user = await getUser(key)
      const success = await bcrypt.compare(user_info.password, user.hash)
      if (!success) {
        res.json({ status: 403, errorMessage: 'Incorrect Email/Password' })
        return
      } else {
        const accessToken = await signAccessToken(key)
        res.cookie('accesstoken', accessToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 15
        })
        res.json({
          status: 200,
          isloggedin: true
        })
      }
    } catch (returned_val) {
      console.log(returned_val)
      res.json({
        status: returned_val.status,
        errorMessage: returned_val.errorMessage
      })
    }
  }
})

app.get('/logout', (req, res) => {
  res.cookie('accesstoken', '', {
    maxAge: 0
  })

  res.json({ status: 200, message: 'logged out' })
})

app.get('/mypapers/:email_id', verifyAccessToken, async (req, res) => {
  console.log(req.params.email_id)
  const email_id = req.params.email_id

  try {
    const papers = await getUserPapers(email_id)
    console.log(papers)
    res.json({
      status: 200,
      papers: papers
    })
  } catch (returned_val) {
    res.json({
      status: returned_val.status,
      errorMessage: returned_val.errorMessage
    })
  }
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
