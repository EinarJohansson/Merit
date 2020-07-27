const router = require('express').Router()

const authCheck = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            authenticated: false,
        })
    } else next()
}
router.get("/", authCheck, (req, res) => {
    res.status(200).json({
        authenticated: true,
        user: req.user,
    })
})

module.exports = router