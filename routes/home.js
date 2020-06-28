const router = require('express').Router()

// Kolla om vi är authade eller inte
const authCheck = (req, res, next) => {          
    if (req.user) res.render('pages/authenticated', {'namn': req.user.given_name})
    else next()
}

router.get('/', authCheck, (req, res) => {
    res.render('pages/home')
})

module.exports = router