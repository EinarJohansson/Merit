const router = require('express').Router()
const insert = require('../database/insert')
const change = require('../database/change')

// Kolla om vi är authade eller inte
const authCheck = (req, res, next) => {
    if (req.user) next()
    else res.redirect('/login')
}
const legitUtbildning = (program, inriktning) => {
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

const legitStatus = (og, ny) => {
    const statusar = ['pågående', 'kommande', 'avslutade'] 
    
    return statusar.includes(og) && statusar.includes(ny)
}

router.post('/utbildning', authCheck, (req, res) => {
    if (typeof req.body.program !== 'undefined' &&
        typeof req.body.inriktning !== 'undefined' &&
        legitUtbildning(req.body.program, req.body.inriktning)) {

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

router.post('/kurs', authCheck, (req, res) => {
    if (typeof req.body.og !== 'undefined' &&
        typeof req.body.ny !== 'undefined' &&
        typeof req.body.kurs !== 'undefined' &&
        legitStatus(req.body.og, req.body.ny)) {

        let gammal = req.user.kurser[req.body.og]
        let ny = req.user.kurser[req.body.ny]

        const pos = gammal.map((k) => { return k.kurs }).indexOf(req.body.kurs)
        let gammal_uppdaterad = []

        for (let i = 0; i < gammal.length; i++) {
            if (i !== pos) gammal_uppdaterad.push(gammal[i])
        }

        let tmp = gammal[pos]
        ny.push(tmp)    

        change(req.user, gammal_uppdaterad, ny, req.body.og, req.body.ny)
        .then(data => {
            console.log(data)
            res.sendStatus(200)
        })
        .catch(err => {
            console.error(err)
            res.sendStatus(400)
        })
    }
    else res.sendStatus(400)
})


module.exports = router
