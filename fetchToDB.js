const fetch = require('node-fetch')
const pool = require('./config')

const countryUrl = 'https://api.teleport.org/api/countries/'
const citiesUrl = 'https://api.teleport.org/api/urban_areas/'

const getJson = async (url) => {
  try {

    const response = await fetch(url)
    const json = await response.json()
    return json
  } catch (error) {
    console.log(error)
  }
}

const insertCountriesToDB = async (json) => {
  const res = await json
  const countries = res._links['country:items']

  countries.forEach(async country => {
    pool.query(`INSERT INTO countries (country) VALUES (?)`, [country.name], (err) => {
      if (err) console.log(err)
    })
  });
}

const insertCitiesToDB = async (json) => {
  const res = await json
  const cities = res._links['ua:item']

  cities.forEach(async city => {
    const cityJson = await getJson(city.href)
    const tempArr = cityJson._links['ua:countries']
    tempArr.forEach(async country => {
      pool.query(`SELECT country_id FROM countries WHERE country="${country.name}"`, (err, result) => {
        if (err) console.log(err)
        pool.query(`INSERT INTO cities (city, country_id) VALUES(?,?)`, [city.name, result[0].country_id], (err, result) => {
          if (err) console.log(err)
          console.log(result)
        })
      })
    })
  });
}

const insertCostLivingToDB = async () => {
  const cities = await getCities()

  cities[0].forEach(async res => {
    const str = res.city.replace(/\s/g, '-').toLowerCase()
    const city = str.replace(/[,.]/g, '')
    const result = await getJson(`https://api.teleport.org/api/urban_areas/slug:${city}/details/`)
    if (result.categories !== undefined) {
      const costs = result.categories[3].data
      let obj = {}
      costs.forEach(cost => {
        if (cost.id === 'COST-TAXI') {
          obj.taxi = cost.currency_dollar_value
        } else if (cost.id === 'COST-CAPPUCCINO') {
          obj.cappuchino = cost.currency_dollar_value
        } else if (cost.id === 'COST-IMPORT-BEER') {
          obj.beer = cost.currency_dollar_value
        } else if (cost.id === 'COST-FITNESS-CLUB') {
          obj.gym_membership = cost.currency_dollar_value
        } else if (cost.id === 'COST-PUBLIC-TRANSPORT') {
          obj.monthly_public_transport = cost.currency_dollar_value
        } else if (cost.id === 'COST-RESTAURANT-MEAL') {
          obj.lunch = cost.currency_dollar_value
        }

        obj.city_id = res.city_id
      })

      pool.query(`INSERT INTO livingcost SET ?`, obj, (err) => {
        if (err) console.log(err)
      })
    }
  })
}

const getCities = async () => {
  return pool.query('SELECT city, city_id FROM cities')

}

// insertCountriesToDB(getJson(countryUrl))
// insertCitiesToDB(getJson(citiesUrl))
insertCostLivingToDB()


