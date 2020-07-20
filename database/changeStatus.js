// Load environment variables
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient

const changeStatus = (user, gammlaKurser, nyaKurser, og, ny) => {
    return new Promise((resolve, reject) => {
        const client = new MongoClient(process.env.DB_URL)
        client.connect(error => {
            if (error) {
                client.close()
                return reject(error)
            }
            const users = client.db('merit').collection('users')

            const fields = [`kurser.${ny}`, `kurser.${og}`]
            const data = {
                $set: {
                    [fields[0]]: nyaKurser,
                    [fields[1]]: gammlaKurser
                }
            }

            users.updateOne(
                {'_id': user._id},
                data,
                { upsert: true },
                (err, res) => {
                    client.close()
                    if (err) return reject(err)
                    return resolve('Ändrade status!')
                }
            )
        })
    })
}


module.exports = changeStatus