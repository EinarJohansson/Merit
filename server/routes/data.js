// Load environment variables
require('dotenv').config()
const request = require('request');
const  cors = require('cors')

const router = require('express').Router()
const MongoClient = require('mongodb').MongoClient

const corsOptions = {
    origin: 'http://localhost:5000',
    methods: 'GET',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
  
router.use(cors(corsOptions))

// Kolla om vi är authade eller inte
const authCheck = (req, res, next) => {
    if (req.user) next()
    else res.redirect('/login')
}

router.get('/kurser', authCheck, (req, res) => {
    const client = new MongoClient(process.env.DB_URL)
    client.connect(error => {
        if (error) {
            client.close()
            return reject(error)
        }
        const users = client.db('merit').collection('users')

        users.find(
            {_id: req.user._id},
            {projection: {'kurser': true}},
        ).toArray((err, data) => {
            if (err) res.sendStatus(500)
            else res.send(data)
        })
    })
})

router.get('/utbildningar', authCheck, (req, res) => {
    const base = 'http://statistik.uhr.se/rest/stats/tableData?request='

    const params = {
        "tillfalle":req.query.tillfälle,
        "vy":"Antagningspoang",
        "antagningsomgang":req.query.omgång,
        "utbildningstyp":"p",
        "fritextFilter": req.query.sökord,
        "urvalsGrupp": req.query.urval,
        "firstResult":0,
        // "maxResults":25,
        "sorteringsKolumn":1,
        "sorteringsOrdningDesc":false,
        "requestNumber":1,
        "paginate":true
    }

    let url = base + JSON.stringify(params)
    
    var options = {
        'method': 'GET',
        'url': url
    } 

    request(options, (error, response) => {
        if (error) throw new Error(error)
        res.send(response.body)
    })

    /* 
    https://statistik.uhr.se/rest/stats/tableData?request=
        {
            "tillfalle":"Sokande",
            "vy":"Total",
            "antagningsomgang":"HT2020",
            "larosateId":"",
            "utbildningstyp":"",
            "fritextFilter":"datateknik",
            "urvalsGrupp":"",
            "firstResult":0,
            "maxResults":25,
            "sorteringsKolumn":1,
            "sorteringsOrdningDesc":false,
            "requestNumber":1,
            "paginate":true
        }
    */
})


module.exports = router