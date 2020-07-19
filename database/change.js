const { ObjectID } = require('mongodb')

// Load environment variables
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient

const change = (user, gammlaKurser, nyaKurser, og, ny) => {
    return new Promise((resolve, reject) => {
        const client = new MongoClient(process.env.DB_URL)
        client.connect(error => {
            if (error) {
                client.close()
                return reject(error)
            }
            const users = client.db('merit').collection('users')

            const fields = [`kurser.${ny}`, `kurser.${og}`]
            const agg = {
                $set: {
                    [fields[0]]: nyaKurser,
                    [fields[1]]: gammlaKurser
                }
            }

            users.updateOne(
                {'_id': user._id},
                agg,
                { upsert: true },
                (err, res) => {
                    client.close()
                    if (err) return reject(err)
                    return resolve(res)
                }
            )
        })
    })
}


module.exports = change