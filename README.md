# Quality of life - Final Project

## Idea

We chose to create a "Quality of life comparer" where the user can see, for example, living costs and housing prices of many different cities and compare against another.

The main reason for this application is to find out the cost of living and housing for a certain city or country.

Example of questions you would like the answer to:

* How much is the average price for a beer in the U.K?
* How much is the rent for a large apartment in Stockholm?
* How much does a lunch cost in Salt Lake City?

In using the "Quality of life" application the user gets the answer to these questions and can prepare travel or move to a city of their choice.

The data is collected from [Teleport.org](https://teleport.org).

## ER Diagram / Logical model

![ER diagram](https://github.com/niklasnilsson87/2dv513/blob/master/finalProject/images/ER-diagram.jpeg)

We chose to separate the data of the cities into two entities (housing and livingCost) in order for the city table to be as independent as possible since housing and livingCost might be added later on. We separated countries from cities in order to be able to get details from multiple cities in one country, which we are using in the application when the user wants to compare the average costs between the countries. LivingCost and housing are separated since we thought that they are different categories and therefore it would be easier to add another table to link a city to, for example if we would like to add education statistics.

Each country in `countries` can hold 0 or many cities and each city in `cities` can only have a relation to one and only one country. Each city can have 0 or one housing and livingCost, while both housing and livingCost can only have one, and only one city related to it.

## Design in SQL

### countries

For this table, we used country_id as a primary key to hold each country’s name that we put into our database. The id is auto-increment and we used not null and unique for each country name.

~~~~sql
CREATE TABLE countries (
    country_id INT AUTO_INCREMENT,
    country VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (country_id)
  );
~~~~

### cities

For this table, we also included a `city_id` as a primary key and on auto-increment to have a relation between the other tables. We store the `city` - attribute as the name of the city and information gathered from the API. The foreign key is the `country_id` which has a relation to the `countries` entity.

~~~~sql
CREATE TABLE cities (
    city_id INT PRIMARY KEY AUTO_INCREMENT,
    city VARCHAR(50) NOT NULL UNIQUE,
    information TEXT,
    country_id INT NOT NULL,
    FOREIGN KEY (country_id) REFERENCES countries(country_id)
  );
~~~~


### livingcost

For this table, we use the `city_id` as the primary key to hold each tuple since it’s dependent on a specific city. The table has the foreign key of `city_id` to create a relation between livingcost and cities entity and to link each livingcost to the correct city. The rest of the attributes are floats, gathered from the API we used which collects prices of each. We used `ON DELETE CASCADE` to delete a tuple when deleting a city.

~~~~sql
CREATE TABLE livingcost (
    city_id INT NOT NULL,
    taxi FLOAT,
    cappuchino FLOAT,
    beer FLOAT,
    gym_membership FLOAT,
    monthly_public_transport FLOAT,
    lunch FLOAT,
    PRIMARY KEY (city_id),
    FOREIGN KEY (city_id) REFERENCES cities(city_id)
    ON DELETE CASCADE
  );
~~~~

### housing

For this table, we also used the `city_id` as primary key and foreign key since there can be only one city related to each tuple. The rest of the attributes are floats, gathered from the API we used which collects prices of each.  We used `ON DELETE CASCADE` to delete a tuple when deleting a city.

~~~~sql
CREATE TABLE housing (
    city_id INT NOT NULL,
    large_appt INT,
    medium_appt INT,
    small_appt INT,
    rent_index FLOAT,
    PRIMARY KEY (city_id),
    FOREIGN KEY (city_id) REFERENCES cities(city_id)
    ON DELETE CASCADE
  );
~~~~

## Queries

### Queries for inserting data to the database from the API

Note: All red values in the queries are variables/objects

~~~~sql
INSERT IGNORE INTO countries (country) VALUES (?), country.name;
~~~~

We loop through each country provided from the API and insert each `country.name` into the table `countries` on the attribute `country`. If the API provides ut with duplicates, we ignore those using the `INSERT IGNORE` statement.

~~~~sql
SELECT country_id FROM countries WHERE country="country.name";
~~~~

When inserting cities to the database, we first select the `country_id` related to that city which is needed while inserting the city to the database since it’s related to a `country_id`.

~~~~sql
INSERT IGNORE INTO cities (city, country_id) VALUES(?,?), city.name, result.country_id;
~~~~

We loop through all cities from the API and perform a query for each city where we get `city.name` from the API and `result.country_id` is gained from the query above. If the API provides ut with duplicates, we ignore those using the `INSERT IGNORE` statement.

~~~~sql
INSERT INTO livingcost SET ? obj;
~~~~

We create an object (obj) that contains the needed values for creating a tuple in `livingcost` which we insert to `livingcost`. The `SET` method inserts each value in the object to the correct position.

~~~~sql
INSERT INTO housing SET ? obj;
~~~~

Same procedure as the above query, but for housing.

~~~~sql
UPDATE cities SET information=description WHERE city=data.city;
~~~~

We struggled with inserting the city description at the same time as inserting a city and therefore we chose to perform a query to update the tuples in `cities` after. `data.city` is the description provided from the API.

~~~~sql
SELECT city, city_id FROM cities;
~~~~

This is a help-function that is needed when inserting city descriptions, livingcost, and housing since they are all related to a city.

### Queries for displaying data in the application

~~~~sql
SELECT city, city_id, country_id FROM cities ORDER BY city;
~~~~

This query is needed to display the dropdown fields with all cities listed in them, in order for the user to pick two cities to compare. We query the `country_id` in order to know what country the city belongs to, which is later used if the user wants to compare the average costs between countries in the cities selected.

~~~~sql
SELECT cities.city, livingcost.*, housing.*, cities.information
    FROM livingcost
    INNER JOIN housing ON livingcost.city_id = housing.city_id
    INNER JOIN cities ON livingcost.city_id = cities.city_id
    WHERE housing.city_id IN (body.first, body.second);
~~~~

This is where we get all the necessary information for a specific city, such as city name, living costs, housing costs, and city description. `body.first` is the city selected from the first dropdown field and `body.second` is the other city selected from the second dropdown field.

~~~~sql
SELECT country
  FROM countries
  WHERE country_id IN (
    SELECT country_id
    FROM cities
    WHERE city_id = city);
~~~~

This query is performed when the user wants to compare the average costs in the countries that the cities belong to, where we first select the `country_id` for the city and then selecting the `country` (country name) from the countries table.

~~~~sql
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
        WHERE country_id IN (
            SELECT country_id
            FROM countries
            WHERE country_id IN (
                SELECT country_id
                FROM cities
                WHERE city_id = city )));
~~~~

We create a view for this long query that is used to provide the average costs for all details that a city has. We use `TRUNCATE` in order to limit the number of decimals to 2 since we otherwise would get too many decimals with the results. `AVG` is used to get the average. We chose to rename the columns by giving them aliases because we weren’t able to target the columns when they had parenthesis.

~~~~sql
SELECT * FROM CountryAverage;
~~~~

Here we select the results from the view created above.

## Implementation

The implementation can be found here.

### Installation instructions

#### Prerequisites

* Node.js
* Npm
* MySQL and a database created with the name `life-quality-comparer`

#### Steps

* In the console/terminal  
    Navigate to the folder where you have downloaded the app  
    `cd finalProject/server`  
    `npm install && npm run server`  
    `cd ..`  
    `cd client`  
    `npm install && npm run dev`  
* General
    Open the .env file located in `finalProject/server/` directory.
    Change the variables to fit your environment.

~~~~javascript
DB_HOST=localhost
DB_USER=root
DB_PWD=root
DB_NAME=life-quality-comparer
DB_SOCKET='optional socket port path'
~~~~

Visit [localhost:5000](http://localhost:5000) in your web browser.

## Supplemental video
