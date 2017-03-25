var express = require('express')
var app = express()
var path = require('path')

app.set('port', (process.env.PORT || 5000))

app.use(express.static('public'))
app.get('/', function (request, response) {
  response.sendFile((path.join(__dirname, '/views/index.html')))
})

app.listen(app.get('port'), function () {
  console.log('Listening on port', app.get('port'))
})
