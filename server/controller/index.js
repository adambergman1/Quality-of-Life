const pool = require('../db/config')

const indexController = {}

indexController.index = (req, res) => {

  pool.query("Select city FROM cities")
    .then(([result]) => {
      console.log('fetching cities')
      res.send(JSON.stringify(result))
    })
}

indexController.post = (req, res) => {
  const { data } = req.body
  console.log(data)
  res.send('You sent me a post request!!')
}

module.exports = indexController