var express = require('express')
var app = express()
var path = require('path')
var favicon = require('serve-favicon')
var bodyParser = require('body-parser')
var chefu = require("./chefu")

// var mongodb = require('mongodb')

// const mongoUri = ('mongodb://localhost:27017' || process.env.MONGODB_URI)
// mongodb.MongoClient.connect(mongoUri, function (err, database) {
//   if (err) {
//     console.log(err)
//     process.exit(1)
//   }
//   // attach the database (db) to app
//   app.db = database
//   console.log('MongoDB connected.')
// })

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
  var ingredients = [request.body.item1]
  if(request.body.item2 != 'null')
  {
  	ingredients.push(request.body.item2)
  }

  console.log(ingredients)
  var recipe = chefu.askChefu(ingredients)

  response.send(JSON.stringify(recipe))
})

// forgive me friends i need to test playbill project LOL
app.post('/choreo-test', function (request, response) {
  console.log(request.body)
  response.status(200).send('IT WORKS!! FUCK YEAH!!')
})

app.listen(app.get('port'), function () {
  console.log("Sending Chefü to Culinary School...")
  chefu.attendCulinarySchool();
  console.log('Chefü listening on port', app.get('port'))
})
