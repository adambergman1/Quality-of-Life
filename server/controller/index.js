const pool = require('../db/config')

const indexController = {}

indexController.cities = (req, res) => {
  pool.query('Select city, city_id, country_id FROM cities ORDER BY city')
    .then(([result]) => {
      console.log('fetching cities')
      res.send(JSON.stringify(result))
    })
}

indexController.cityDetails = (req, res) => {
  const { body } = req

  const queryCities = `
    SELECT livingcost.*, housing.* 
    FROM livingcost 
    JOIN housing ON livingcost.city_id = housing.city_id 
    WHERE housing.city_id IN (${body.first}, ${body.second});
  `

  pool.query(queryCities).then(([result]) => {
    console.log('Fetching cities data...')
    res.send(JSON.stringify(result))
  })
}

indexController.countries = (req, res) => {
  const { body } = req
}

module.exports = indexController
