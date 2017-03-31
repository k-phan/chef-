//Allrecipes scraper

//http://allrecipes.com/recipes/86/world-cuisine/

//http://allrecipes.com/recipes/227/world-cuisine/asian/
//http://allrecipes.com/recipes/231/world-cuisine/european/

//body -> .slider-container -> .site-content -> .body-content -> .recipe-hub -> div -> #grid -> .column -> article -> travel to first <a href ..... 

var request = require("request"),
cheerio = require("cheerio"),
file = require("fs"),
mongoClient = require("mongodb");

var mongoURL = (process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/culinarySchool')
var db;
mongoClient.connect(mongoURL, function(err, database){
  if(!err)
  {
    db = database;
  }
});

/////////////////////////////////////////////
var categories = [
  // "http://allrecipes.com/recipes/86/world-cuisine/",
  "http://allrecipes.com/recipes/227/world-cuisine/asian/",
  "http://allrecipes.com/recipes/231/world-cuisine/european/"
  // "http://allrecipes.com/recipes/236/us-recipes/",
  // "http://allrecipes.com/recipes/80/main-dish/",
  // "http://allrecipes.com/recipes/17561/lunch/",
  // "http://allrecipes.com/recipes/92/meat-and-poultry/",
  // "http://allrecipes.com/recipes/17562/dinner/",
  // "http://allrecipes.com/recipes/1642/everyday-cooking/",
  // "http://allrecipes.com/recipes/84/healthy-recipes/",
  // "http://allrecipes.com/recipes/201/meat-and-poultry/chicken/",
  // "http://allrecipes.com/recipes/16954/main-dish/chicken/"
  ]
// var folderName = "asian";
////////////////////////////////////////////

var n = 0;
var cuisine = categories[n];
console.log("Link : " + cuisine);
scrapeDirectory(cuisine);

function scrapeDirectory(cuisine){

  request(cuisine, function(error, response, body){
    console.log("categories [" + n + "]");
    console.log("Scraping " + cuisine + "...");

    var links = [];
    $ = cheerio.load(body);
    $('body .site-content .recipe_hub article a').each( function () {
      var link = $(this).attr("href");
      if(link)
      {    
        if(link.indexOf("/recipe/") >= 0){
          links.push(link);
        }
      }
    });
    console.log("Scraping " + links.length + " recipes...");
    for(var i = 0; i < links.length; i++){
      createEntry("http://allrecipes.com" + links[i]);
    }
    n++;
    if(n < categories.length)
    {
      setTimeout(function(){scrapeDirectory(categories[n]);}, 1000);
    }
    else
    {
      db.close();
      process.exit(1);
    }
  });
}


function createEntry(URL)
{
  request(URL, function(error, response, body){
    if(!error)
    {
      $ = cheerio.load(body);
      var container = $("body .site-content .recipe-container-outer .ar_recipe_index");
      var title = container.find(".summary-background .recipe-summary h1").text();

      var ingredients = [];

      container.find(".recipe-ingredients .checklist .checkList__line label .recipe-ingred_txt").each(function() {
        var ingred = $(this).text();
        if(ingred.indexOf("Add all ingredients to list") == -1)
        {
          ingredients.push($(this).text());
        }
      });

      var obj = {
        name : title,
        ingredientList : ingredients,
      }

      title = title.split(' ').join('_');
      db.listCollections().toArray(function(err, names){
        if(names.length > 0)
        {
          db.collection("recipes").insertOne(obj, function(err, result){
            if(err)
            {
              console.log(err);
            }
          });
        }
        else
        {
          db.createCollection("recipes", function(err, collection){
            if(err)
            {
              console.log(err);
            }
            else
            {
              collection.insertOne(obj, function(err, result){
                if(err)
                {
                  console.log(err);
                }
              });
            }
          });
        }
      })

      // file.writeFile(folder + "/" + title + ".json", JSON.stringify(obj), function(err){
      //   if(err){
      //     return console.log("error writing " + title + ".json : " + err.toString);
      //   }
      // })

    }
    else
    {
      console.log (error);
    }
  });
}