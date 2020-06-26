const passport = require('../passport/passport')
const router = require('express').Router()

router.get('/', passport.authenticate('google', { scope: ['profile'] }))

router.get('/callback/', passport.authenticate('google', { failureRedirect: '/login', successRedirect: '/' }))

module.exports = router