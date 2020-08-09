const { Double } = require('mongodb')

// Load environment variables
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient

const create = (user) => {
  return new Promise((resolve, reject) => {
    const client = new MongoClient(process.env.DB_URL)

    client.connect(error => {
      if (error) return reject(error)
      const users = client.db('merit').collection('users')

      users.find(user).toArray((err, response) => {
        if (err) return reject(err)

        if (response.length > 0) {
          client.close()
          return resolve('Användaren fanns redan!')
        }
        // Lägg till Gymnasiegemensammama kurser
        user.kurser =
        {
          'Svenska 1': {
            poäng: 100,
            typ: 'Gymnasiegemensamma',
            betyg: 'E',
            merit: Double(0.0),
            status: 'pågående'
          },
          'Svenska 2': {
            poäng: 100,
            typ: 'Gymnasiegemensamma',
            betyg: 'E',
            merit: Double(0.0),
            status: 'pågående'
          },
          'Svenska 3': {
            poäng: 100,
            typ: 'Gymnasiegemensamma',
            betyg: 'E',
            merit: Double(0.0),
            status: 'pågående'
          },
          'Engelska 5': {
            poäng: 100,
            typ: 'Gymnasiegemensamma',
            betyg: 'E',
            merit: Double(0.0),
            status: 'pågående'
          },
          'Engelska 6': {
            poäng: 100,
            typ: 'Gymnasiegemensamma',
            betyg: 'E',
            merit: Double(0.0),
            status: 'pågående'
          },
          'Matematik 1': {
            poäng: 100,
            typ: 'Gymnasiegemensamma',
            betyg: 'E',
            merit: Double(0.0),
            status: 'pågående'
          },
          'Historia 1': {
            poäng: 50,
            typ: 'Gymnasiegemensamma',
            betyg: 'E',
            merit: Double(0.0),
            status: 'pågående'
          },
          'Samhällskunskap 1': {
            poäng: 100,
            typ: 'Gymnasiegemensamma',
            betyg: 'E',
            merit: Double(0.0),
            status: 'pågående'
          },
          'Religionskunskap': {
            poäng: 50,
            typ: 'Gymnasiegemensamma',
            betyg: 'E',
            merit: Double(0.0),
            status: 'pågående'
          }
        }

        users.insertOne(user, (e, res) => {
          if (e) return reject(e)
          resolve('Inserta en ny användare!')
        })
        client.close()
      })
    })
  })
}

module.exports = create