//Chefüuüuüuüuüuüuüu

var brain = require("lda"),
	school = require("mongodb").MongoClient;


var mongoURL = ('mongodb://127.0.0.1:27017/culinarySchool' || process.env.MONGODB_URI)

var memories;
//modüle.exports
module.exports = {
	//attendCülinarySchül : fünction(){}
	attendCulinarySchool : function(){
		school.connect(mongoURL, function(err, database) {
			if(err)
			{
				console.log("Could not make it to culinarySchool...");
				console.log(err);
				process.exit(1);
			}
			else
			{
				console.log("[info] Using database : " + database.databaseName.toString());

				var collection = database.collection("stuff");
				if(collection != null)
				{
					readSomeBooks(collection);
				}
				database.close();
			}
		});
	},
	askChefu : function(array){
		var possibles = [];

		for(var i = 0; i < memories.length; i++)
		{
			for(var j = 0; j < memories[i].length; j++)
			{
				var found = [];
				//how many items suggested by the user are actually in this generated topic
				for(var k = 0; k < array.length; k++)
				{
					var memItem = memories[i][j].term.toLowercase();
					var userItem = array[k].toLowercase();

					if(memItem.indexOf(userItem) >= 0 || userItem.indexOf(memItem) >= 0)
					{
						found.push(array[k]);
					}
				}

				//if any found, add to possibles.
				if(found > 0)
				{
					var obj = {
						index : i,
						relevancy : found.length,
						hits : found,
					}
					possibles.push(obj);
				}
			}
		}

		//sort in descending order (greatest to least)
		possibles.sort(function(a,b){
			return b.relevancy - a.relevancy;
		});


		//if we found a recipe that was most relevant.
		// if(possibles[0].relevancy == array.length)
		// {

			//for right now lets just return the most relevant recipe.
		var recipeMemory = memories[possibles[0].index];
		var recipe = [];
		for(var i = 0; i < recipeMemory.length; i++)
		{
			recipe.push(recipeMemory[i].term);
		}

		//make sure we include everything LOL
		for(var j = 0; j < array.length; j++)
		{
			if(recipe.toLowercase().indexOf(array[j].toLowercase()) < 0){
				recipe.push("and some " + array[j]);
			}
		}
		// }

		return recipe;

	}
}


function readSomeBooks(collection)
{
	var books = [];
	//Get all mongo docs here and push onto books
	collection.find().toArray(function(err, docs){
		if(err){
			console.log(err);
			process.exit(1);
		}
		else
		{
			for(var i = 0; i < docs.length; i++)
			{
				var list = docs[i].ingredientList.join(" ");
				books.push(list);
			}
		}
	});

	memories = brain(books, Math.floor(Math.random() * (25-10) + 10), 10);
}