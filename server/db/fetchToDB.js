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

/** JSON -> Promise Error [ResultSetHeader] */
const insertCountriesToDB = async (json) => {
  const res = await json
  const countries = res._links['country:items']

  return Promise.all(countries.map(country =>
    pool.query(`INSERT IGNORE INTO countries (country) VALUES (?)`, [country.name])
  ))
}

/** JSON -> Promise Error [[ResultSetHeader]] */
const insertCitiesToDB = async (json) => {
  const res = await json
  const cities = res._links['ua:item']

  return Promise.all(cities.flatMap(async city => {
    const cityJson = await getJson(city.href)
    const countries = cityJson._links['ua:countries']

    return Promise.all(countries.map(country =>
      pool.query(`SELECT country_id FROM countries WHERE country="${country.name}"`)
        .then(([[result]]) => pool.query(`INSERT IGNORE INTO cities (city, country_id) VALUES(?,?)`, [city.name, result.country_id]))
    ))
  }))
}

const insertCostLivingToDB = async () => {
  const cities = await getCities()

  cities[0].forEach(async city => {
    const result = await fetchCityDetails(city)

    if (result.categories !== undefined) {
      result.categories.forEach(cat => {
        insertCostOfLiving(cat, city)
        insertHousing(cat, city)
      })
    }
  })
}

const insertCostOfLiving = (cat, city) => {
  if (cat.id === 'COST-OF-LIVING') {
    let costs = cat.data
    const obj = getLivingCostObj(costs, city)
    pool.query(`INSERT INTO livingcost SET ?`, obj, (err) => {
      if (err) console.log(err)
    })
  }
}

const insertHousing = (cat, city) => {
  if (cat.id === 'HOUSING') {
    let costs = cat.data
    const obj = getHousingObj(costs, city)
    pool.query(`INSERT INTO housing SET ?`, obj, (err) => {
      if (err) console.log(err)
    })
  }
}

const getLivingCostObj = (costs, res) => {
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

  return obj
}

const fetchCityDetails = async (res) => {
  const str = res.city.replace(/\s/g, '-').toLowerCase()
  const city = str.replace(/[,.]/g, '')
  const result = await getJson(citiesUrl + 'slug:' + city + '/details/')
  return result
}

const fetchCityDescription = async () => {
  const cities = await getCities()

  cities[0].forEach(async data => {
    const str = data.city.replace(/\s/g, '-').toLowerCase()
    const city = str.replace(/[,.]/g, '')

    const response = await fetch(citiesUrl + 'slug:' + city + '/scores/')
    const json = await response.json()

    if (json.summary !== undefined) {
      const regex = json.summary.replace(/\s\s+/g, ' ')
      const s = regex.replace(/(<([^>]+)>)/ig, "");
      const description = s.replace(/\n/g, "")

      pool.query(`UPDATE cities SET information=${JSON.stringify(description.trim())} WHERE city='${data.city}'`, (err) => {
        if (err) console.log(err)
      })
    }
  })
}

const getHousingObj = (costs, res) => {
  let obj = {}

  costs.forEach(cost => {
    if (cost.id === 'APARTMENT-RENT-LARGE') {
      obj.large_appt = cost.currency_dollar_value
    } else if (cost.id === 'APARTMENT-RENT-MEDIUM') {
      obj.medium_appt = cost.currency_dollar_value
    } else if (cost.id === 'APARTMENT-RENT-SMALL') {
      obj.small_appt = cost.currency_dollar_value
    } else if (cost.id === 'RENT-INDEX-TELESCORE') {
      obj.rent_index = cost.float_value
    }
    obj.city_id = res.city_id
  })

  return obj
}

const getCities = () => pool.query('SELECT city, city_id FROM cities')

insertCountriesToDB(getJson(countryUrl))
  .then(() => insertCitiesToDB(getJson(citiesUrl)))
  .then(() => Promise.all([fetchCityDescription(), insertCostLivingToDB()]))
  .then(() => {
    setTimeout(() => {
      console.log('All done')
      process.exit(0)
    }, 3000);
  })
  .catch(console.error)
