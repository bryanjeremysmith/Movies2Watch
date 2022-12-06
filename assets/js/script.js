var baseYouTubeURL = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyAS3ZMf20tOKozGt4fbv5HHPCGhFEZFuco";
var baseIMDBURL = "http://www.omdbapi.com/?apikey=9e1ba2cf&";
let movieTitleText = JSON.parse(window.localStorage.getItem("movieTitleText")) || [];

//This code is called on startup, when the document is ready
$(document).ready(function () {
    getMovieList();
    $("#cardHolder").hide();
    $("#smallSearch").hide();
});

//This function hides the large search button in the center of the screen, and shows the small search query.
function search() {
    $("#startBtn").hide();
    $("#smallSearch").show();
};
//  Add text to button 
$(".cardBtnHolder > .button").text("+ Add to List");

function appendToMoviesList() {
    saveMovieTitle();
    getMovieList();
};

//This will save the movie title to the local storage.
function saveMovieTitle() {
    let movieVal = $("#movie-title").text();
    movieTitleText.unshift(movieVal);
    window.localStorage.setItem("movieTitleText", JSON.stringify(movieTitleText));
};

//This will grab the movie titles from local storage, then create clickable list items for each movie found in local storage.
function getMovieList() {
    movieTitleText = JSON.parse(window.localStorage.getItem("movieTitleText")) || [];
    var movieList = document.querySelector("#moviesList");
    movieList.innerHTML = "";
    for (let i = 0; i < movieTitleText.length; i++) {
        var newMovie = document.createElement("li");
        newMovie.textContent = movieTitleText[i];
        movieList.appendChild(newMovie);

        newMovie.addEventListener("click", function () {
            search();
    
            var q = this.textContent;
    
            searchIMDB(q);    
        });
        // remove, add text and class to the watch to list button 
        $(".cardBtnHolder > .button").removeClass("addBtnText");
        $(".cardBtnHolder > .button").text("✓ Added to the List");
        $(".cardBtnHolder > .button").addClass("addGreenBtnText");
    }
};

//Function to get the search value from #query, then search IMDB.
function searchAPIs() {
    search();

    var q = $('#query').val();

    searchIMDB(q);
}

//Function to get the search value from #querySmall, then search IMDB.
function searchAPIsSmall() {
    search();

    var q = $('#querySmall').val();

    searchIMDB(q);
}

//This queries IMDB with the title and requesting a short plot.
function searchIMDB(q) {
    var requestIMDB = baseIMDBURL + "&t=" + q + "&plot=short";
    fetch(requestIMDB)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //If the data response is "False", then the movie wasn't found
            if (data.Response === "False") {
                $("#movie-title").text(data.Error);
                $("#movie-plot").text("");
                $('#movie-embedded-video').html("");

                $("#watch-trailer").addClass("hide");
                $("#add-movie").addClass("hide");
                $("#cardHolder").show();
            }
            //Otherwise, then populate the values on the page, then query YouTube
            else {
                $("#movie-title").text(data.Title);
                $("#movie-plot").text(data.Plot);
                $("#watch-trailer").addClass("visible");
                $("#add-movie").addClass("visible");
                searchYouTube(q + " " + data.Year);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

//This queries YouTube appending " trailer" to the end of the movie title and movie year.
function searchYouTube(q) {
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
        .then(function (data) {
            $('#movie-embedded-video').html('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + data.items[0].id.videoId + '?autoplay=1&mute=1"></iframe>');
            $("#cardHolder").show();
        })
        .catch(function (error) {
            console.log(error);
        });
}

// enter key 
$("#query").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        searchAPIs();
    }
});