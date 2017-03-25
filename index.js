var express = require('express')
var app = express()
var path = require('path')
var favicon = require('serve-favicon')

app.set('port', (process.env.PORT || 5000))
app.use(favicon(path.join(__dirname, '/public/favicon.ico')))

app.use(express.static('public'))
app.get('/', function (request, response) {
  response.sendFile((path.join(__dirname, '/views/index.html')))
})

app.get('/chefu', function (request, response) {
  response.send('THIS IS WHAT CHEFU WOULD BE')
})

app.listen(app.get('port'), function () {
  console.log('Listening on port', app.get('port'))
})
