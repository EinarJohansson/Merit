const router = require('express').Router()
const insert = require('../database/insert')
const changeStatus = require('../database/changeStatus')
const changeKurs = require('../database/changeKurs')
const removeKurs = require('../database/removeKurs')

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
        inriktningVal[req.program].includes(req.inriktning)
}

router.post('/utbildning', authCheck, (req, res) => {
    if (legitUtbildning(req.body)) {

        // Spara program och inriktningen i databasen
        const program = req.body.program
        const inriktning = req.body.inriktning

        insert(req.user, { 'program': program, 'inriktning': inriktning })
            .then(data => console.log('Uppdaterade utbildning'))
            .catch(err => console.error(err))
    }

    res.redirect('/')
})

const legitStatus = (req) => {
    const statusar = ['pågående', 'kommande', 'avslutade'] 
    
    return typeof req.status !== 'undefined' &&
        typeof req.kurs !== 'undefined' &&
        statusar.includes(req.status)
}

router.post('/status', authCheck, (req, res) => {
    if (legitStatus(req.body)) {
        changeStatus(req.user._id, req.body.kurs, req.body.status)
        .then(data => {
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
    const statusar = ['pågående', 'kommande', 'avslutade']
    const poäng = ['50', '100', '150']
    const merit = ['0', '0.5', '1']
    const betyg = ['A', 'B', 'C', 'D', 'E', 'F', '']

    return typeof req.kurs !== undefined &&
        typeof req.kod !== undefined &&
        typeof req.poäng !== undefined && 
        typeof req.betyg !== undefined && 
        typeof req.merit !== undefined && 
        poäng.includes(req.poäng.toString()) &&
        merit.includes(req.merit.toString()) &&
        betyg.includes(req.betyg.toString()) && 
        statusar.includes(req.status.toString())
}

router.post('/kurs', authCheck, (req, res) => {
    if (legitKurs(req.body.nykurs)) {

        changeKurs(req.user._id,
            req.body.ogkurs,
            req.body.nykurs
        ).then(data => {
            console.log(data)
            res.sendStatus(200)
        }).catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
    } else res.sendStatus(400) 
})

router.post('/remove', authCheck, (req, res) => {
    if (req.body.kurs) {
        removeKurs(req.user._id, req.body.kurs.toString())
        .then(data => res.send(data))
        .catch(err => res.sendStatus(500))
    }
    else res.sendStatus(400)
})

 router.post('/merit', authCheck, (req, res) => {
    if (req.body.merit && req.body.jämföreseltal && req.body.meritvärde) {
        // Lägg till eller ändra befintlig
        insert(req.user, {  'merit': req.body.merit,
                            'jämföreseltal': req.body.jämföreseltal,
                            'meritvärde': req.body.meritvärde
        })
        .then(data => console.log('Uppdaterade meritvärde'))
        .catch(err => console.error(err))    
    }
    res.redirect('/')
})

module.exports = router
