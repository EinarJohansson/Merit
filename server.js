// Dependencies
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('./passport/passport')
const home = require('./routes/home')
const auth = require('./routes/auth')
const login = require('./routes/login')

// The app
const app = express()
const port = 3000

// App config
app.set('view engine', 'ejs')

// Passport config
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: process.env.COOKIE }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', home)
app.use('/auth', auth)
app.use('/login', login)

// Listen for connections
app.listen(port, () => console.log('Listening on port: ' + port))