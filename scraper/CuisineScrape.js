//Allrecipes scraper

//http://allrecipes.com/recipes/86/world-cuisine/

//http://allrecipes.com/recipes/227/world-cuisine/asian/
//http://allrecipes.com/recipes/231/world-cuisine/european/

//body -> .slider-container -> .site-content -> .body-content -> .recipe-hub -> div -> #grid -> .column -> article -> travel to first <a href ..... 

var request = require("request"),
    cheerio = require("cheerio"),
    file = require("fs");


/////////////////////////////////////////////
var cuisine = "http://allrecipes.com/recipes/227/world-cuisine/asian/";
var folderName = "asian";
////////////////////////////////////////////


request(cuisine, function(error, response, body){

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
    createEntry("http://allrecipes.com" + links[i], folderName);
  }
});


function createEntry(URL, folder)
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
      file.writeFile(folder + "/" + title + ".json", JSON.stringify(obj), function(err){
        if(err){
          return console.log("error writing " + title + ".json : " + err.toString);
        }
      })

    }
    else
    {
      console.log ("Error running createEntry : " + error.toString());
    }
  });
}