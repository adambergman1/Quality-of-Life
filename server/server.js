const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const PORT = 4000

app.use(cors())
app.use(bodyParser.json())

app.use(require('./routes'))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
