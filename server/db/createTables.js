const pool = require('./config')

const cities = `
  CREATE TABLE cities (
    city_id INT PRIMARY KEY AUTO_INCREMENT,
    city VARCHAR(50) NOT NULL UNIQUE,
    information TEXT,
    country_id INT NOT NULL,
    FOREIGN KEY (country_id) REFERENCES countries(country_id)
  )
`
const countries = `
  CREATE TABLE countries (
    country_id INT AUTO_INCREMENT,
    country VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (country_id)
  )
`
const livingCost = `
  CREATE TABLE livingcost (
    cost_id INT PRIMARY KEY AUTO_INCREMENT,
    taxi FLOAT,
    cappuchino FLOAT,
    beer FLOAT,
    gym_membership FLOAT,
    monthly_public_transport FLOAT,
    lunch FLOAT,
    city_id INT NOT NULL,
    FOREIGN KEY (city_id) REFERENCES cities(city_id)
  )
`

const housing = `
  CREATE TABLE housing (
    city_id INT NOT NULL,
    large_appt INT,
    medium_appt INT,
    small_appt INT,
    rent_index FLOAT,
    PRIMARY KEY (city_id),
    FOREIGN KEY (city_id) REFERENCES cities(city_id)
  )
`

const runQueries = async () => {
  try {
    await pool.query('DROP TABLE IF EXISTS livingcost')
    await pool.query('DROP TABLE IF EXISTS housing')
    await pool.query('DROP TABLE IF EXISTS cities')
    await pool.query('DROP TABLE IF EXISTS countries')

    await pool.query(countries)
    await pool.query(cities)
    await pool.query(livingCost)
    await pool.query(housing)

    process.exit(0)
  } catch (error) {
    console.log(error)
  }
}

runQueries()
