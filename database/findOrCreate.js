// Load environment variables
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient

const findOrCreate = (user) => {
  return new Promise((resolve, reject) => {
    const client = new MongoClient(process.env.DB_URL)

    client.connect(error => {
      if (error) return reject(error)
      const users = client.db('merit').collection('users')

      users.find(user).toArray((err, response) => {
        if (err) return reject(err)

        if (response.length > 0) {
          client.close()
          return resolve(response)
        }
        users.insertOne(user, (e, res) => {
          if (e) return reject(e)
          resolve(res.ops)
        })
        client.close()
      })
    })
  })
}

module.exports = findOrCreate