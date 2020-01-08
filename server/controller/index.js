const pool = require('../db/config')

const indexController = {}

indexController.cities = (req, res) => {
  pool.query('SELECT city, city_id, country_id FROM cities ORDER BY city')
    .then(([result]) => {
      console.log('Fetching all cities')
      res.send(JSON.stringify(result))
    })
}

indexController.cityDetails = (req, res) => {
  const { body } = req

  const queryCities = `
    SELECT cities.city, livingcost.*, housing.*, cities.information
    FROM livingcost 
    INNER JOIN housing ON livingcost.city_id = housing.city_id
    INNER JOIN cities ON livingcost.city_id = cities.city_id
    WHERE housing.city_id IN (${body.first}, ${body.second})
    ;
  `

  pool.query(queryCities).then(([result]) => {
    console.log('Fetching cities information...')
    res.send(JSON.stringify(result))
  })
}

indexController.countries = async (req, res) => {
  const { body } = req

  const firstCountry = await getCountryAvg(body.firstCity)
  const secondCountry = await getCountryAvg(body.secondCity)

  const obj = {
    firstCountry,
    secondCountry
  }

  res.send(JSON.stringify(obj))
}

async function getCountryAvg (city) {
  const country = `
  SELECT country
  FROM countries
  WHERE country_id IN (
    SELECT country_id 
    FROM cities 
    WHERE city_id = ${city}
  )
;
`

  const createView = `
  CREATE OR REPLACE VIEW CountryAverage AS
    SELECT
    TRUNCATE(AVG(livingcost.taxi), 2) AS 'taxi', 
    TRUNCATE(AVG(livingcost.cappuchino), 2) AS 'cappuchino', 
    TRUNCATE(AVG(livingcost.beer), 2) AS 'beer', 
    TRUNCATE(AVG(livingcost.gym_membership), 2) AS 'gym', 
    TRUNCATE(AVG(livingcost.monthly_public_transport), 2) AS 'public_transport', 
    TRUNCATE(AVG(livingcost.lunch), 2) AS 'lunch',
    TRUNCATE(AVG(housing.small_appt), 2) AS 'small_appt',
    TRUNCATE(AVG(housing.medium_appt), 2) AS 'medium_appt',
    TRUNCATE(AVG(housing.large_appt), 2) AS 'large_appt',
    TRUNCATE(AVG(housing.rent_index), 2) AS 'rent_index'
    FROM livingcost
    JOIN housing ON livingcost.city_id = housing.city_id
    WHERE livingcost.city_id IN (
        SELECT city_id FROM cities
        WHERE country_id IN
        (
            SELECT country_id
            FROM countries
            WHERE country_id IN
            (
                SELECT country_id
                FROM cities
                WHERE city_id = ${city}
            )
        )
    )
;
`

  await pool.query(createView)

  const getCountryAverage = `
  SELECT * FROM CountryAverage;
  `

  const [countryName] = await pool.query(country)
  const [[countryAvgValues]] = await pool.query(getCountryAverage)

  const obj = {
    country: countryName[0].country,
    beer: countryAvgValues.beer,
    cappuchino: countryAvgValues.cappuchino,
    taxi: countryAvgValues.taxi,
    gym: countryAvgValues.gym,
    public_transport: countryAvgValues.public_transport,
    lunch: countryAvgValues.lunch,
    small_appt: countryAvgValues.small_appt,
    medium_appt: countryAvgValues.medium_appt,
    large_appt: countryAvgValues.large_appt,
    rent_index: countryAvgValues.rent_index
  }
  return obj
}

module.exports = indexController
