// Load environment variables
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient

const changeKurs = (user, ogkurs, nykurs) => {
    return new Promise((resolve, reject) => {
        const client = new MongoClient(process.env.DB_URL)
        client.connect(error => {
            if (error) {
                client.close()
                return reject(error)
            }
            const users = client.db('merit').collection('users')

            users.updateOne(
                {
                    '_id': user,
                    'kurser.kurs': ogkurs.kurs
                },
                {
                    $set:
                    {
                        'kurser.$': nykurs
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

module.exports = changeKurs
