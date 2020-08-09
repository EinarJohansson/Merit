const router = require('express').Router()

// Kolla om vi är authade eller inte
const authCheck = (req, res, next) => {          
    if (req.user) next()
    else res.redirect('/login')
}

router.get('/', authCheck, (req, res) => {
    req.logout()
    res.redirect('http://localhost:5000')
})

module.exports = router
