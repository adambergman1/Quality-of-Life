const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const PORT = 4000;

app.use(bodyParser.json())

app.use(require('./routes'))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))