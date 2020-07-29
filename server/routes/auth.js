const passport = require('../passport/passport')
const router = require('express').Router()

router.get('/', passport.authenticate('google', {scope: ['profile'] }))

router.get('/callback', passport.authenticate('google', {
        successRedirect: 'http://localhost:5000',
        failureRedirect: '/auth/login/failed'
    })
)

router.get('/login/failed', (req, res) => {
    res.status(401).json({
        success: false,
        message: "user failed to authenticate."
    })
})

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
         res.send(200);
     } else {
         next();
     }
    });
router.get('/login/success', (req, res) => {
    if (req.user) {
        res.status(200).json({
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