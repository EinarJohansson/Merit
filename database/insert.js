// Load environment variables
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient

const insert = (user, data) => {
    return new Promise((resolve, reject) => {

        // Nu har jag användaren.
        const client = new MongoClient(process.env.DB_URL)
        client.connect(error => {
            if (error) {
                client.close()
                return reject(error)
            }
            const users = client.db('merit').collection('users')

            users.updateOne(user, 
                {$set: data},
                (err, result) => {
                    client.close()
                    if (err) {
                        return reject(err)
                    }
                    return resolve(result)
                }
            )
        })
    })
}

module.exports = insert