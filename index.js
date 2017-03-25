var express = require('express')
var app = express()
var path = require('path')
var port = 5000

app.use(express.static('public'))
app.get('/', function (request, response) {
  response.sendFile((path.join(__dirname + '/views/index.html')))
})

app.listen(port, function () {
  console.log('Listening on port', port)
})
