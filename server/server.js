require('dotenv').config()

// Dependencies
const cookieSession = require('cookie-session')
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('./passport/passport')
const cors = require('cors')

// The app
const app = express()
const port = 3000


app.use(
  cors({
    credentials: true // allow session cookie from browser to pass through
  })
);

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session(
    {
      secret: process.env.COOKIE,
      resave: true,
      saveUninitialized: false,
      cookie: { secure: false }
    }
  )
)
app.use(passport.initialize())
app.use(passport.session())

// Routes
const auth = require('./routes/auth')
app.use('/auth', auth)
const logout = require('./routes/logout')
app.use('/logout', logout)
const update = require('./routes/update')
app.use('/update', update)
const data = require('./routes/data')
app.use('/data', data)
const home = require('./routes/home')
app.use('/', home)

// Listen for connections
app.listen(port, () => console.log('Listening on port: ' + port))