var baseYouTubeURL = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyAS3ZMf20tOKozGt4fbv5HHPCGhFEZFuco";
var baseIMDBURL = "http://www.omdbapi.com/?apikey=9e1ba2cf&";

$(document).ready(function() {
    $("#cardHolder").hide();
    $("#smallSearch").hide();           
});

function search() {
    $("#startBtn").hide();
    $("#smallSearch").show();
};
//  Add text to button 
$(".cardBtnHolder > .button").text("+ Add to List");

function appendToMoviesList() {
    var movieList = document.querySelector("#moviesList");
    var newMovie = document.createElement("li");
    newMovie.textContent = $("#movie-title").text();
    movieList.appendChild(newMovie);

    newMovie.addEventListener("click", function(){
        search();

        var q = this.textContent;

        searchIMDB(q);
    });
    // remove, add text and clas to the watch to list button 
    $(".cardBtnHolder > .button").removeClass("addBtnText");
    $(".cardBtnHolder > .button").text("✓ Added to the List");
    $(".cardBtnHolder > .button").addClass("addGreenBtnText");
    
};

// Search for a specified string.
function searchAPIs() {
    search();

    var q = $('#query').val();

    searchIMDB(q);
}

function searchAPIsSmall() {
    search();

    var q = $('#querySmall').val();

    searchIMDB(q);
}

function searchIMDB(q){
    var requestIMDB = baseIMDBURL + "&t=" + q + "&plot=short";
    fetch(requestIMDB)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        $("#movie-title").text(data.Title);
        $("#movie-plot").text(data.Plot);
        searchYouTube(q + " " + data.Year);
    })
    .catch(function (error){
        console.log(error);
    });
}

function searchYouTube(q){
    var requestYouTube = baseYouTubeURL + 
        "&q=" + q + " trailer" + 
        "&part=snippet" + 
        "&order=rating" + 
        "&type=video" + 
        "&videoDefinition=high" + 
        "&videoEmbeddable=true" +
        "&maxResults=1";

    fetch(requestYouTube)
    .then(function (response) {
        return response.json();
    })
    .then(function (data){
        $('#movie-embedded-video').html('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + data.items[0].id.videoId + '?autoplay=1&mute=1"></iframe>');
        $("#cardHolder").show();
    })
    .catch(function (error){
        console.log(error);
    });
}

// enter key 
$("#query").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        searchAPIs();
    }
});