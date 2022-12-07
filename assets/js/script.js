
var baseYouTubeURL = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyAS3ZMf20tOKozGt4fbv5HHPCGhFEZFuco";
var baseIMDBURL = "http://www.omdbapi.com/?apikey=9e1ba2cf&";
var movieTitleName = ""; // declare empty var 
let addRmvBtn = $(".cardBtnHolder > .button");

// --- Read the local storage and set it to a variable ---	
let movieTitleList = JSON.parse(window.localStorage.getItem("movieTitleList")) || [];

$(document).ready(function () {
    $("#cardHolder").hide(); 
    $("#smallSearch").hide(); 
    console.log(movieTitleList); // just checking
});

function search() {
    $("#startBtn").hide(); 
    $("#smallSearch").show(); 
};

//  ---- Creating the movie list function----
function appendToMoviesList() {
    saveMovieTitle();
    getMovieList();
    disableAddBtn();
};

// Note changed movieTitleText to movieTitleList because of the new variable
function saveMovieTitle() {
    let movieVal = $("#movie-title").text();
    movieTitleList.unshift(movieVal);
    window.localStorage.setItem("movieTitleList", JSON.stringify(movieTitleList));
};

function getMovieList() {
    movieTitleList = JSON.parse(window.localStorage.getItem("movieTitleList")) || [];
    var movieList = document.querySelector("#moviesList");
    movieList.innerHTML = "";
    for (let i = 0; i < movieTitleList.length; i++) {
        var newMovie = document.createElement("li");
        newMovie.textContent = movieTitleList[i];
        movieList.appendChild(newMovie);

        newMovie.addEventListener("click", function () {
            search();
            var q = this.textContent;
    
            searchIMDB(q);    
        }); 
    }
};

getMovieList();



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

function searchIMDB(q) {
    var requestIMDB = baseIMDBURL + "&t=" + q + "&plot=short";
    fetch(requestIMDB)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.Response === "False") {
                $("#movie-title").text(data.Error);
                $("#movie-plot").text("");
                $('#movie-embedded-video').html("");

                $("#watch-trailer").addClass("hide");
                $("#add-movie").addClass("hide");
                $("#cardHolder").show();
                $(".cardBtnHolder").hide(); // hide add button on error
                
            }
            else {
                $("#movie-title").text(data.Title);
                $("#movie-plot").text(data.Plot);
                $("#watch-trailer").addClass("visible");
                $("#add-movie").addClass("visible");
                $("#cardHolder").show();
                $(".cardBtnHolder").show(); // show add button
                // searchYouTube(q + " " + data.Year); // comment it out when youtube quote is full
                var movieTitleName = $("#movie-title").text(); //populate var movieTitleName
                evaluateMovieTitle(movieTitleName);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}


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

// --- Checking the movie title against the movie list ---
function evaluateMovieTitle (movieTitleName) {
    console.log(movieTitleName);
    if (movieTitleList.indexOf(movieTitleName) === -1) { // not repeating name on list
       //console.log("False"); BLUE BUTTON
       addRmvBtn.attr("class", "button rounded addBtnText");
       addRmvBtn.text("+ Add to List");
       addRmvBtn.attr("onclick","appendToMoviesList()");
		
	} else {
	 disableAddBtn();
	}
}
// --- "Added to the list" disable button ---
function disableAddBtn() {
    addRmvBtn.attr("class", "button rounded addGreenBtnText");
    addRmvBtn.text("✓ Added to the List");
    addRmvBtn.attr("onclick", "null");
}
// ---- Enter key ----
$("#query").on('keyup', function(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        searchAPIs();
    }
});