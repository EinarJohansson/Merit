const router = require('express').Router()

const authCeck = (req, res, next) => {          
    if (req.user) res.render('pages/authenticated')
    else next()
}

router.get('/', authCeck, (req, res) => {
    // Kolla om vi är authade eller inte
    res.render('pages/home')
})

module.exports = router