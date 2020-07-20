const router = require('express').Router()
const insert = require('../database/insert')
const changeStatus = require('../database/changeStatus')
const changeKurs = require('../database/changeKurs')

// Kolla om vi är authade eller inte
const authCheck = (req, res, next) => {
    if (req.user) next()
    else res.redirect('/login')
}
const legitUtbildning = (req) => {
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
    return typeof req.program !== 'undefined' &&
        typeof req.inriktning !== 'undefined' &&
        programVal.includes(req.program) && 
        inriktningVal[program].includes(req.inriktning)
}

router.post('/utbildning', authCheck, (req, res) => {
    if (legitUtbildning(req.body)) {

        // Spara program och inriktningen i databasen
        const program = req.body.program
        const inriktning = req.body.inriktning

        insert(req.user, { 'program': program, 'inriktning': inriktning })
            .then(data => console.log(data))
            .catch(err => console.error(err))
    }

    res.redirect('/')
})

const legitStatus = (req) => {
    const statusar = ['pågående', 'kommande', 'avslutade'] 
    
    return typeof req.og !== 'undefined' &&
        typeof req.ny !== 'undefined' &&
        typeof req.kurs !== 'undefined' &&
        statusar.includes(req.og) &&
        statusar.includes(req.ny)
}

router.post('/status', authCheck, (req, res) => {
    if (legitStatus(req.body)) {
        let gammal = req.user.kurser[req.body.og]
        let ny = req.user.kurser[req.body.ny]

        const pos = gammal.map((k) => { return k.kurs }).indexOf(req.body.kurs)
        let gammal_uppdaterad = []

        for (let i = 0; i < gammal.length; i++) {
            if (i !== pos) gammal_uppdaterad.push(gammal[i])
        }

        let tmp = gammal[pos]
        ny.push(tmp)    

        changeStatus(req.user, gammal_uppdaterad, ny, req.body.og, req.body.ny)
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

const legitKurs = (req) => {
    const poäng = ['50', '100', '150']
    const merit = ['0', '0.5', '1']
    const betyg = ['A', 'B', 'C', 'D', 'E', 'F', 'Obestämt']

    return typeof req.kurs !== undefined &&
        typeof req.kod !== undefined &&
        typeof req.poäng !== undefined && 
        typeof req.betyg !== undefined && 
        typeof req.merit !== undefined && 
        poäng.includes(req.poäng) &&
        merit.includes(req.merit) &&
        betyg.includes(req.betyg)
}

router.post('/kurs', authCheck, (req, res) => {
    if (legitKurs(req.body.nykurs) && legitKurs(req.body.ogkurs)) {

        changeKurs(req.user._id,
            req.body.ogkurs,
            req.body.nykurs,
            req.body.ogstatus,
            req.body.nystatus
        ).then(data => {
            console.log(data)
            res.sendStatus(200)
        }).catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
    } else res.sendStatus(400) 
})

module.exports = router
