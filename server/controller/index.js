const indexController = {}

indexController.index = (req, res) => {
  res.send('Hello World')
}

indexController.post = (req, res) => {
  const { data } = req.body
  console.log(data)
  res.send('You sent me a post request!!')
}

module.exports = indexController