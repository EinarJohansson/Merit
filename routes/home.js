const router = require('express').Router()

// Kolla om vi är authade eller inte
const authCheck = (req, res, next) => {
    if (req.user) {
        const data =
            {
                'namn': req.user.name,
                'bild': req.user.picture,
                'program': req.user.program,
                'inriktning': req.user.inriktning,
                'kurser': req.user.kurser
            } || { 'namn': req.user.name, 'bild': req.user.picture, 'kurser': req.user.kurser}

        res.render('pages/profil', data)
    }
    else next()
}

router.get('/', authCheck, (req, res) => {
    res.render('pages/home')
})

module.exports = router