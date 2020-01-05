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

indexController.countries = async (req, res) => {
  const { body } = req

  const firstCountry = `
    SELECT country
    FROM countries
    WHERE country_id IN (
      SELECT country_id 
      FROM cities 
      WHERE city_id = ${body.firstCity}
    )
  ;
  `

  const secondCountry = `
  SELECT country
  FROM countries
  WHERE country_id IN (
    SELECT country_id 
    FROM cities 
    WHERE city_id = ${body.secondCity}
  )
;
`

  const getFirstCountryAverage = `
  SELECT 
  TRUNCATE(AVG(livingcost.taxi), 2) AS 'taxi', 
  TRUNCATE(AVG(livingcost.cappuchino), 2) AS 'cappuchino', 
  TRUNCATE(AVG(livingcost.beer), 2) AS 'beer', 
  TRUNCATE(AVG(livingcost.gym_membership), 2) AS 'gym', 
  TRUNCATE(AVG(livingcost.monthly_public_transport), 2) AS 'public_transport', 
  TRUNCATE(AVG(livingcost.lunch), 2) AS 'lunch'
  FROM livingcost
  WHERE city_id IN (
      SELECT city_id FROM cities
      WHERE country_id IN
      (
          SELECT country_id
          FROM countries
          WHERE country_id IN
          (
              SELECT country_id
              FROM cities
              WHERE city_id = ${body.firstCity}
          )
      )
  );
`

  const getSecondCountryAverage = `
  SELECT 
  TRUNCATE(AVG(livingcost.taxi), 2) AS 'taxi', 
  TRUNCATE(AVG(livingcost.cappuchino), 2) AS 'cappuchino', 
  TRUNCATE(AVG(livingcost.beer), 2) AS 'beer', 
  TRUNCATE(AVG(livingcost.gym_membership), 2) AS 'gym', 
  TRUNCATE(AVG(livingcost.monthly_public_transport), 2) AS 'public_transport', 
  TRUNCATE(AVG(livingcost.lunch), 2) AS 'lunch'
  FROM livingcost
  WHERE city_id IN (
      SELECT city_id FROM cities
      WHERE country_id IN
      (
          SELECT country_id
          FROM countries
          WHERE country_id IN
          (
              SELECT country_id
              FROM cities
              WHERE city_id = ${body.secondCity}
          )
      )
  );
`
  const [first] = await pool.query(firstCountry)
  const [second] = await pool.query(secondCountry)

  const [[firstCountryAvgValues]] = await pool.query(getFirstCountryAverage)
  const [[secondCountryAvgValues]] = await pool.query(getSecondCountryAverage)

  const obj = {
    firstCountry: {
      country: first[0].country,
      beer: firstCountryAvgValues.beer,
      cappuchino: firstCountryAvgValues.cappuchino,
      taxi: firstCountryAvgValues.taxi,
      gym: firstCountryAvgValues.gym,
      public_transport: firstCountryAvgValues.public_transport,
      lunch: firstCountryAvgValues.lunch
    },
    secondCountry: {
      country: second[0].country,
      beer: secondCountryAvgValues.beer,
      cappuchino: secondCountryAvgValues.cappuchino,
      taxi: secondCountryAvgValues.taxi,
      gym: secondCountryAvgValues.gym,
      public_transport: secondCountryAvgValues.public_transport,
      lunch: secondCountryAvgValues.lunch
    }
  }

  res.send(JSON.stringify(obj))
}

module.exports = indexController
