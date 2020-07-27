// Load environment variables
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient

const changeStatus = (id, kurs, status) => {
    return new Promise((resolve, reject) => {
        const client = new MongoClient(process.env.DB_URL)
        client.connect(error => {
            if (error) {
                client.close()
                return reject(error)
            }
            const users = client.db('merit').collection('users')

            const field = `kurser.${kurs}.status`

            users.updateOne(
                {'_id': id},
                {
                    $set: {[field]: status}
                },
                (err, res) => {
                    client.close()
                    if (err) return reject(err)
                    return resolve(res)
                }
            )
        })
    })
}


module.exports = changeStatus