// Load environment variables
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient

const removeKurs = (id, kurs) => {
    return new Promise((resolve, reject) => {
        const client = new MongoClient(process.env.DB_URL)
        client.connect(error => {
            if (error) {
                client.close()
                return reject(error)
            }
            const users = client.db('merit').collection('users')
            const field = `kurser.${kurs}`

            users.updateOne(
                { _id: id },
                {
                    $unset: {
                        [field]: true
                    }
                },
                (err, res) => {
                    client.close()
                    if (err) return reject(err)
                    else return resolve(res)
                }
            )
        })
    })
}


module.exports = removeKurs