const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const { adminEditRouter } = require('./app/routes/adminEdit')
const { usersRouter } = require('./app/routes/usersRoute')
const {
  insertNewUser,
  checkUserExistsQuery,
  getUser,
  setLoginStatus,
  clearLoginStatus,
  getLoginStatus,
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
app.use(express.text())
app.use(express.urlencoded({extended: false}))

// * REGISTERING DIFFERENT ROUTERS
app.use('/admin', adminEditRouter)
app.use('/user', usersRouter)

// * TEST ENPOINT
app.post('/test', (req, res) => {
  console.log(req.body)
})

// * CHECK IF USER EXISTS IN DATABASE AND IS LOGGED IN
app.post('/checkuser', verifyAccessToken, async (req, res) => {
  const payload = req.payload
  const windowname = req.body.data.windowname

  console.log(52, req.payload)

  if (payload) {
    if (payload.id === serverconfig.ADMIN_SECRET_KEY) {
      res.json({ isloggedin: true })
    } else {
      try {
        let userExists = await checkUserExistsQuery(payload.id)
        let login_status = (await getLoginStatus(payload.id)).response
          .login_status

        if (userExists === true) {
          if (login_status === null) {
            let r = (Math.random() + 1).toString(36).substring(2)
            const updatedResult = await setLoginStatus(payload.id, r)
            if (updatedResult.status === 200)
              res.json({
                isloggedin: true,
                alreadyOpened: false,
                windowname: r
              })
          } else if (login_status === windowname)
            res.json({ isloggedin: true, alreadyOpened: false })
          else res.json({ isloggedin: true, alreadyOpened: true })
        } else res.json({ isloggedin: false })
      } catch (returned_val) {
        console.log(78, returned_val)
        res.json({
          status: returned_val.status,
          errorMessage: returned_val.errorMessage
        })
      }
    }
  } else {
    res.json({
      status: 403,
      errorMessage: 'Unauthorized Access'
    })
  }
}) // ✅

// * ADMIN SESSION | WHEN ADMIN DECIDES TO MAKE CHANGES
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

// * WHEN USERS ACCESS PROFILE PAGE
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
    res.json({ status: 200, user: { response: user }, isadmin: true })
  } else {
    try {
      const user = await getUser(payload.id)
      res.json({ status: 200, user: user })
    } catch (returned_val) {
      res.json({
        status: returned_val.status,
        errorMessage: returned_val.errorMessage
      })
    }
  }
})

// * WHEN USER CREATES A NEW ACCOUNT
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
      // ! If user exists, show UserExistsError
      const userExists = await checkUserExistsQuery(key)
      if (userExists === false) {
        try {
          const insert_response = await insertNewUser(user_info)
          if (insert_response)
            res.json({ status: 200, errorMessage: 'User registered!' })
        } catch (returned_val) {
          console.error(returned_val)
          res.json({
            status: returned_val.status,
            errorMessage: returned_val.errorMessage
          })
        }
      } else res.json({ status: 401, errorMessage: 'User already exists!' })
    } catch (returned_val) {
      console.error(returned_val)
      res.json({
        status: returned_val.status,
        errorMessage: returned_val.errorMessage
      })
    }
  }
})

// * WHEN USER TRIES TO LOG IN
app.post('/login', async (req, res) => {
  const user_info = req.body.data
  const key = user_info.email

  if (key === serverconfig.ADMIN_SECRET_KEY) {
    console.log('admin')
    const success = user_info.password === 'adminpassword'
    if (success) {
      // * CREATE ACCESSTOKEN
      const accesstoken = await signAccessToken(key)

      // * SET COOKIE IN BROWSER
      res.cookie('accesstoken', accesstoken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 15
      })
      res.json({ status: 200, isloggedin: true })
    } else
      res.json({ status: 403, errorMessage: 'Incorrect username/password' })
  } else {
    // * REGULAR USER
    try {
      const user = (await getUser(key)).response
      const success = await bcrypt.compare(user_info?.password, user?.hash)
      if (!success) {
        // ! INCORRECT CREDENTIALS
        res.json({ status: 403, errorMessage: 'Incorrect Email/Password' })
        return
      } else {
        // * LOG USER IN AND SIGN A NEW ACCESSTOKEN FOR 15 MINUTES
        const accessToken = await signAccessToken(key)

        // * SET WINDOW NAME AS LOGIN STATUS
        const updatedResult = await setLoginStatus(key, user_info.windowname)

        if (updatedResult.status === 200) {
          res.cookie('accesstoken', accessToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 15
          })
          res.json({
            status: 200,
            isloggedin: true,
            login_status: updatedResult.updated
          })
        }
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

// * LOG USER OUT
app.get('/logout', (req, res) => {
  // * GET RID OF THE COOKIE
  res.cookie('accesstoken', '', {
    maxAge: 0
  })

  res.json({ status: 200, message: 'logged out' })
})

// * FETCH ALL PAPERS BY EMAIL ID
app.get('/mypapers/:email_id', verifyAccessToken, async (req, res) => {
  const email_id = req.params.email_id
  try {
    const papers = await getUserPapers(email_id)
    res.json({ status: 200, papers: papers })
  } catch (returned_val) {
    res.json({
      status: returned_val.status,
      errorMessage: returned_val.errorMessage
    })
  }
})

// * CLEAR WINDOW NAME AND CLEAR LOGIN STATUS (USEFUL FOR ISOLATED ACCESS)
app.post('/clearwindowname', async (req, res) => {
  console.log(274, req.body)
  const windowname = JSON.parse(req.body).key
  console.log(276, windowname)

  if (windowname !== '') {
    const updatedResult = await clearLoginStatus(windowname)
    if (updatedResult.status === 200) console.log('cleared window name')
    else console.log(284, updatedResult)
  }
})

// * ANALYTICS
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
