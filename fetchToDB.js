const fetch = require('node-fetch')
const pool = require('./config')

const url = 'https://api.teleport.org/api/countries/'

const getJson = async () => {
    const response = await fetch(url)
    const json = await response.json()
    return json
}

const insertToDB = async (json) => {
    const res = await json

    const countries = res._links['country:items']

    countries.forEach(country => {
        pool.query(`INSERT INTO countries (country) VALUES (?)`, [country.name], (err) => {
            if (err) console.log(err)
        })
    });
}

insertToDB(getJson())
console.log(getJson())

