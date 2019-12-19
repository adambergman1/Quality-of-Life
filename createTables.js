const pool = require('./config')

const cities = `
    CREATE TABLE cities (
        city_id INT PRIMARY KEY AUTO_INCREMENT,
        city VARCHAR(50) NOT NULL,
        information TEXT,
        country_id INT NOT NULL,
        FOREIGN KEY (country_id) REFERENCES countries(country_id)
    )
`
const countries = `
CREATE TABLE countries (
    country_id INT AUTO_INCREMENT,
    country VARCHAR(50) NOT NULL,
    PRIMARY KEY (country_id)
)
`
const livingCost = `
CREATE TABLE livingcost (
    cost_id INT PRIMARY KEY AUTO_INCREMENT,
    taxi FLOAT NOT NULL,
    cappuchino FLOAT NOT NULL,
    beer FLOAT NOT NULL,
    gym_membership FLOAT NOT NULL,
    monthly_public_transport FLOAT NOT NULL,
    lunch FLOAT NOT NULL,
    city_id INT NOT NULL,
    FOREIGN KEY (city_id) REFERENCES cities(city_id)
)
`

const runqueries = async () => {

    try {
        await pool.query('DROP TABLE IF EXISTS livingcost')
        await pool.query('DROP TABLE IF EXISTS cities')
        await pool.query('DROP TABLE IF EXISTS countries')
        await pool.query(countries)
        await pool.query(cities)
        await pool.query(livingCost)
        process.exit(0)
    } catch (error) {
        console.log(error)
    }
}

runqueries()
