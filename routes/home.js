const router = require('express').Router()

// Kolla om vi är authade eller inte
const authCheck = (req, res, next) => {          
    if (req.user) res.render('pages/profil', {'namn': req.user.name, 'bild': req.user.picture})
    else next()
}

router.get('/', authCheck, (req, res) => {
    res.render('pages/home')
})

module.exports = router