const passport = require('../passport/passport')
const router = require('express').Router()

router.get('/', passport.authenticate('google', {scope: ['profile'] }))
router.get('/callback/', passport.authenticate('google', {failureRedirect: '/auth/login/failed', successRedirect: '/auth/login/success' }))

router.get('/login/failed', (req, res) => {
    res.status(401).json({
        success: false,
        message: "user failed to authenticate."
    })
})

router.get('/login/success', (req, res) => {
    if (req.user) {
        console.log(req.user);
        res.json({
            success: true,
            message: "user has successfully authenticated",
            cookies: req.cookies,
            user: req.user
        });
    } else {
        res.status(401).json({
            success: false,
            message: "user failed to authenticate."
        })
    }
})
module.exports = router