var express = require('express')
var app = express()
var path = require('path')
var favicon = require('serve-favicon')
var bodyParser = require('body-parser')

app.set('port', (process.env.PORT || 5000))
app.use(favicon(path.join(__dirname, '/public/favicon.ico')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'))
app.get('/', function (request, response) {
  response.sendFile((path.join(__dirname, '/views/index.html')))
})

app.get('/chefu', function (request, response) {
  response.sendFile((path.join(__dirname, '/views/chefu.html')))
})

// request.body.item1 && request.body.item2 have the two wanted items
app.post('/ask_chefu', function (request, response) {
  // do stuff & then send json or whatever
  console.log(request.body)
  response.redirect('/chefu')
})

app.listen(app.get('port'), function () {
  console.log('Listening on port', app.get('port'))
})
