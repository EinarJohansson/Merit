// Load environment variables
require('dotenv').config()

// Dependencies
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const create = require('../database/create_user')
const MongoClient = require('mongodb').MongoClient

// Lagra användaren i en kaka
passport.serializeUser((user, done) => {
    done(null, user.id)
})

// Hämta användaren
passport.deserializeUser((id, done) => {
    const client = new MongoClient(process.env.DB_URL)
    client.connect(error => {
        if (error)  {
            client.close()
            done(null, false, {'message': error})
        }
        const users = client.db('merit').collection('users')

        users.find({'sub': id }).toArray((err, response) => {
            client.close()
            if (err || response.length <= 0) done(null, false, {'message': err})
            
            done(null, response[0])
        })
    })
})

// Passport google OAuth2 strategi
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://dev.merit.com:3000/auth/callback"
}, (accessToken, refreshToken, profile, done) => {
    create(profile._json)
        .then(data => console.log(data))
        .catch(err => console.error(err))

    done(null, profile)
}))

module.exports = passport