const { Double, Int32 } = require('mongodb')

// Load environment variables
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient

const changeKurs = (user, ogkurs, nykurs, ogstatus, nystatus) => {
    return new Promise((resolve, reject) => {
        const client = new MongoClient(process.env.DB_URL)
        client.connect(error => {
            if (error) {
                client.close()
                return reject(error)
            }
            const users = client.db('merit').collection('users')

            /*
            1. [ ] Hitta den orginella kursen.
            2. [ ] Ta bort den orginella kursen.
            3. [ ] Inserta den nya kursen.
            */ 

            let bulk = users.initializeOrderedBulkOp()
            const fields = [`kurser.${ogstatus.toLowerCase()}`, `kurser.${nystatus.toLowerCase()}`]
            
            console.log(fields);

            bulk.find({
                _id: user
            })
            .updateOne(
           {
                $pull: {
                    [fields[0]]: {
                        kurs: ogkurs.kurs
                    }
                }
            },
            false,
            true
            )

            bulk.find({
                _id: user
            })
            .updateOne({
                $push: {
                    [fields[1]]: {
                        kurs: nykurs.kurs,
                        typ: nykurs.kod,
                        poäng: parseInt(nykurs.poäng),
                        betyg: nykurs.betyg === 'Obestämt' ? '' : nykurs.betyg,
                        merit: parseFloat(nykurs.merit)
                    }
                }
            })

            bulk.execute((err, res) => {
                client.close()
                if (err) return reject(err)
                return resolve(res)
            })
        })
    })
}

module.exports = changeKurs
