var baseYouTubeURL = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyAS3ZMf20tOKozGt4fbv5HHPCGhFEZFuco";
var baseIMDBURL = "https://www.omdbapi.com/?apikey=9e1ba2cf&";
var movieTitleName = ""; // declare empty var 
let addRmvBtn = $(".cardBtnHolder > .button");

// --- Read the local storage and set it to a variable ---
let movieTitleList =
  JSON.parse(window.localStorage.getItem("movieTitleList")) || [];

//This code is called on startup, when the document is ready
$(document).ready(function () {
  getMovieList();
  $("#cardHolder").hide();
  $("#smallSearch").hide();
  console.log(movieTitleList); // just checking
});

//This function hides the large search button in the center of the screen, and shows the small search query.
function search() {
  $("#startBtn").hide();
  $("#smallSearch").show();
}

//  ---- Creating the movie list function----
function appendToMoviesList() {
  saveMovieTitle();
  getMovieList();
  disableAddBtn();
};

// This will save the movie title to the local storage.
function saveMovieTitle() {
  let movieVal = $("#movie-title").text();
  movieTitleList.unshift(movieVal);
  window.localStorage.setItem("movieTitleList", JSON.stringify(movieTitleList));
};

//This will grab the movie titles from local storage, then create clickable list items for each movie found in local storage.
function getMovieList() {
  movieTitleList = JSON.parse(window.localStorage.getItem("movieTitleList")) || [];
  var movieList = document.querySelector("#moviesList");
  movieList.innerHTML = "";
  for (let i = 0; i < movieTitleList.length; i++) {
    var movie = document.createElement("li");
    movie.setAttribute("class", "savedMovie");
    var newMovie = document.createElement("span");
    newMovie.textContent = movieTitleList[i];
    // This will add an option to remove the movie from the watchlist
    var removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    movie.appendChild(newMovie);
    movie.append(removeBtn);
    movieList.append(movie);
    newMovie.addEventListener("click", function () {
      search();
      var q = this.textContent;
      searchIMDB(q);
    });

    // This will remove array item from local storage
    removeBtn.addEventListener("click", function (event) {
      // event.stopPropagation(); // needs to be added in at some point
      var index = movieTitleList.indexOf(this.parentNode.children[0].textContent);
      this.parentNode.remove();
      var deletedMovieTitle = movieTitleList.splice(index, 1);
      localStorage.setItem("movieTitleList", JSON.stringify(movieTitleList));
      if (deletedMovieTitle == $("#movie-title").text()) {
        evaluateMovieTitle(deletedMovieTitle);
      }
    });
  }
};

//Function to get the search value from #query or #querySmall (depending on visibility), then search IMDB.
function searchAPIs() {
  var q = '';

  if ($('#query').is(":visible")) {
    q = $('#query').val().trim();
  }
  else {
    q = $('#querySmall').val().trim();
  }

  if (q === '') {
    return;
  }
  searchIMDB(q);

  search();
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
        // added a new error message 
        $("#movie-title").addClass("errorHeader");
        $("#movie-plot").html('Please <a onclick="pageRefresh()">search</a> again');
        $("#movie-plot").addClass("errorSubheader");
        $('#movie-embedded-video').hide();
        $("#watch-trailer").addClass("hide");
        $("#add-movie").addClass("hide");
        $("#cardHolder").show();
        $(".cardBtnHolder").hide(); // hide add button on error

      }
      //Otherwise, then populate the values on the page, then query YouTube
      else {
        $('#movie-embedded-video').show();
        $("#movie-title").removeClass("errorHeader");
        $("#movie-plot").removeClass("errorSubheader");
        $("#movie-title").text(data.Title);
        $("#movie-plot").text(data.Plot);
        $("#watch-trailer").addClass("visible");
        $("#add-movie").addClass("visible");
        $("#cardHolder").show();
        $(".cardBtnHolder").show(); // show add button
        searchYouTube(q + " " + data.Year); // comment it out when youtube quote is full
        var movieTitleName = $("#movie-title").text(); //populate var movieTitleName
        evaluateMovieTitle(movieTitleName);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

//This queries YouTube appending " trailer" to the end of the movie title and movie year.
function searchYouTube(q) {
  var requestYouTube =
    baseYouTubeURL +
    "&q=" +
    q +
    " trailer" +
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
      $("#movie-embedded-video").html(
        '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' +
        data.items[0].id.videoId +
        '?autoplay=1&mute=1"></iframe>'
      );
      $("#cardHolder").show();
    })
    .catch(function (error) {
      console.log(error);
    });
}

// --- Checking the movie title against the movie list ---
function evaluateMovieTitle(movieTitleName) {
  console.log(movieTitleName);
  if (movieTitleList.indexOf(movieTitleName) === -1) {
    // not repeating name on list
    //console.log("False"); BLUE BUTTON
    addRmvBtn.attr("class", "button rounded addBtnText");
    addRmvBtn.text("+ Add to List");
    addRmvBtn.attr("onclick", "appendToMoviesList()");
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

//-----Code to make list items draggable-----//
$(function () {
  $("#moviesList").sortable({
    update: function () {
      console.log("updated");
      movieTitleList = [];
      for (var i = 0; i < $("#moviesList")[0].children.length; i++) {
        movieTitleList.push($("#moviesList")[0].children[i].textContent.substr(0, $("#moviesList")[0].children[i].textContent.length - 1));
      }
      window.localStorage.setItem("movieTitleList", JSON.stringify(movieTitleList));
    }
  });
});

$("#query, #querySmall").on('keyup', function (e) {
  e.stopPropagation();
  if (e.key === 'Enter' || e.keyCode === 13) {
    console.log('key up function works');
    searchAPIs();
  }
});

//Reload page by clicking the logo
$("#logoText").on("click", pageRefresh);

function pageRefresh() {
  console.log("click logo");
  location.reload(true);

}