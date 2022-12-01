var baseYouTubeURL = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyAS3ZMf20tOKozGt4fbv5HHPCGhFEZFuco";
var baseIMDBURL = "http://www.omdbapi.com/?apikey=9e1ba2cf&";

// Search for a specified string.
function search() {
    var q = $('#query').val();

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
        $('#movie-embedded-video').html('<iframe src="https://www.youtube.com/embed/' + data.items[0].id.videoId + '?autoplay=1&mute=1"></iframe>');
    })
    .catch(function (error){
        console.log(error);
    });
}