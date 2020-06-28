const router = require('express').Router()

// Kolla om vi är authade eller inte
const authCeck = (req, res, next) => {          
    if (req.user) next()
    else res.redirect('/login')
}

router.get('/', authCeck, (req, res) => {
    res.render('pages/profil', {'namn': req.user.name, 'bild': req.user.picture})
})

module.exports = router