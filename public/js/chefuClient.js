function centerModal() {
    $(this).css('display', 'block');
    var $dialog = $(this).find(".modal-dialog");
    var offsetH = ($(window).height() - $dialog.height()) / 2;
    var offsetW = ($(window).width() - $dialog.width()) / 2;
    // Center modal vertically in window
    $dialog.css("margin-top", offsetH);
    $dialog.css("margin-left", offsetW);
}

function showModalRecipe(recipe){
    var header = "<h1> Ta da! </h1>";
    var prefix = "<ul class='list-unstyled'> ";
    var suffix = "</ul>";

    var listItems = "";

    for(var i = 0; i < recipe.length; i++)
    {
        listItems += "<li> " + recipe[i] + "</li>";
    }

    //put our content in.
    $(".modal-body").html(header + prefix + listItems + suffix);
    //Show the recipe!
    $("#ModalGallery").modal("show");
}

$(".chefu-form").submit(function(event){
    event.preventDefault();
    var items = $(".chefu-form :input"); 

    var request = {};
    for (var i = 0; i < items.length - 1; i++)
    {
        request[("item" + (i+1))] = items[i].value; 
    }

    $.post("/ask_chefu", request, function(data, textStatus, jgXHR){

        var recipe = JSON.parse(data);

        showModalRecipe(recipe);

    })
})

$(window).on("resize", function () {
    $('.modal:visible').each(centerModal);
});