// Load environment variables
require('dotenv').config()

const router = require('express').Router()
const MongoClient = require('mongodb').MongoClient

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

module.exports = router