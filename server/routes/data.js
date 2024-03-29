// Load environment variables
require('dotenv').config()
const request = require('request');
const  cors = require('cors')

const router = require('express').Router()
const MongoClient = require('mongodb').MongoClient;
const { response } = require('express');

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
    // Kontrollera mottagandet av termin och urval
    if (!req.query.urval || !req.query.termin)
        return res.sendStatus(404)
    
    // hämta från databasen
    const client = new MongoClient(process.env.DB_URL)
    client.connect(error => {
        if (error) {
            client.close()
            return reject(error)
        }

        const urval = req.query.urval
        const termin = req.query.termin

        const agg = [
            {
              '$project': {
                'aaData': 1, 
                'urval': 1
              }
            }, {
              '$match': {
                'urval': parseInt(urval)
              }
            }, {
              '$project': {
                'program': {
                  '$filter': {
                    'input': '$aaData', 
                    'as': 'data', 
                    'cond': {
                      '$in': [
                        termin, '$$data'
                      ]
                    }
                  }
                }
              }
            }
        ]
        
        const utbildningar = client.db('merit').collection('Utbildningar')

        utbildningar.aggregate(agg).toArray((err, result) => {
            client.close()
            if (err) res.sendStatus(500)
            else res.send(result)
        })
    })
})

router.get('/program', authCheck, (req, res) => {
  if (!req.query.kod) return res.sendStatus(404)
  
  const client = new MongoClient(process.env.DB_URL)
  client.connect(error => {
    if (error) {
      client.close()
      return reject(error)
    }

    const agg = [
        {
          '$project': {
            'program': {
              '$filter': {
                'input': '$aaData', 
                'as': 'data', 
                'cond': {
                  '$eq': [
                    {
                      '$arrayElemAt': [
                        '$$data', 3
                      ]
                    }, req.query.kod
                  ]
                }
              }
            }, 
            'urval': true
          }
        }, {
          '$group': {
            '_id': 'historik', 
            'urval': {
              '$push': '$program'
            }
          }
        }
    ]
      
    const utbildningar = client.db('merit').collection('Utbildningar')
    
    utbildningar.aggregate(agg).toArray((err, result) => {
      client.close()
      if (err) res.sendStatus(500)
      else res.send(result)
    })
  })
})

router.get('/terminer', authCheck, (req, res) => {
  const client = new MongoClient(process.env.DB_URL)
  client.connect(error => {
    if (error) {
      client.close()
      return reject(error)
    }

    const agg = [
      {
        '$unwind': {
          'path': '$aaData', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
      '$unwind': {
        'path': '$aaData', 
        'includeArrayIndex': 'string', 
        'preserveNullAndEmptyArrays': true
      }
      }, {
      '$match': {
        'string': 0
      }
      }, {
      '$group': {
        '_id': null, 
        'terminer': {
          '$addToSet': '$aaData'
        }
      }
    }]

    const utbildningar = client.db('merit').collection('Utbildningar')
    
    utbildningar.aggregate(agg).toArray((err, result) => {
      client.close()
      if (err) res.sendStatus(500)
      else res.send(result)
    })
  })
})

router.post('/bevaka', authCheck, (req, res) => {
  // Kolla om koden finns med
  console.log(req.body);
  if (req.body.hasOwnProperty('kod') && req.body.hasOwnProperty('state')) {
    const client = new MongoClient(process.env.DB_URL)
    client.connect(error => {
      if (error) {
        client.close()
        return res.sendStatus(404)
      }
      const users = client.db('merit').collection('users')

      client.connect(error => {
        if (error) {
          client.close()
          return reject(error)
        }

        if (req.body.state === true) {
          // Om state == true - lägg till
          users.updateOne(
            {
              '_id': req.user._id
            },
            {
              '$addToSet': {
                'bevakningar': req.body.kod
              }
            },
            (err, resp) => {
              client.close()
              if (err) res.sendStatus(500)
              else res.send(resp)
            }
          )
        }
        else if (req.body.state === false) {
          // Om state == false - ta bort
          users.updateOne(
            {
              '_id': req.user._id
            },
            {
              '$pull': {
                'bevakningar': req.body.kod
              }
            },
            (err, resp) => {
              client.close()
              if (err) res.sendStatus(500)
              else res.send(resp)
            }
          )
        }
      })
    })
  }
})

module.exports = router