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

            const ogfield = `kurser.${ogkurs.kurs}`
            const nyfield = `kurser.${nykurs.kurs}`

            console.log(ogkurs.kurs)
            console.log(nykurs.kurs)
            delete nykurs.kurs

            let update
            if (ogfield !== nyfield && ogkurs.kurs)
                update = { $unset: { [ogfield]: true }, $set: { [nyfield]: nykurs } }
            else
                update = { $set: { [nyfield]: nykurs } }

            users.updateOne(
                {
                    '_id': user,
                },
                update,
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
