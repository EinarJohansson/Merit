// Dependencies
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('./passport/passport')

// The app
const app = express()
const port = 3000

// App config
app.set('view engine', 'ejs')

// Passport config
app.use(cookieParser())
app.use( bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: process.env.COOKIE}))
app.use(passport.initialize())
app.use(passport.session())

// Routes
const home = require('./routes/home')
app.use('/', home)
const auth = require('./routes/auth')
app.use('/auth', auth)
const login = require('./routes/login')
app.use('/login', login)
const logout = require('./routes/logout')
app.use('/logout', logout)
const update = require('./routes/update')
app.use('/update', update)

// Listen for connections
app.listen(port, () => console.log('Listening on port: ' + port))