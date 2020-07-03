const router = require('express').Router()
const insert = require('../database/insert')

// Kolla om vi är authade eller inte
const authCheck = (req, res, next) => {
    if (req.user) next()
    else res.redirect('/login')
}
const legit = (program, inriktning) => {
    const programVal = ['Teknik', 'Samhällsvetenskap', 'Naturvetenskap', 'Ekonomi']

    const inriktningVal = {
        'Teknik': [
            'Teknikvetenskap',
            'IT-media',
            'Produktionskunskap',
            'Design'
        ],
        'Samhällsvetenskap': [
            'Samhällsvetenskap',
            'Beteendevetenskap'
        ],
        'Naturvetenskap': [
            'Naturvetenskap',
            'Naturvetenskap och samhälle'
        ],
        'Ekonomi': [
            'Ekonomi'
        ]
    }
    return programVal.includes(program) && inriktningVal[program].includes(inriktning)
}

router.post('/', authCheck, (req, res) => {
    if (typeof req.body.program !== 'undefined' &&
        typeof req.body.inriktning !== 'undefined' &&
        legit(req.body.program, req.body.inriktning)) {

        // Spara program och inriktningen i databasen
        const program = req.body.program
        const inriktning = req.body.inriktning

        insert(req.user, { 'program': program, 'inriktning': inriktning })
            .then(data => {
                console.log(data)
            })
            .catch(err => console.error(err))
    }

    res.redirect('/')
})



module.exports = router
