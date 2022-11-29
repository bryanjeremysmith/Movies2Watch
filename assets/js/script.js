var baseURL = "https://www.googleapis.com/youtube/v3";
var apiKey = "AIzaSyAS3ZMf20tOKozGt4fbv5HHPCGhFEZFuco";

// Search for a specified string.
function search() {
    var q = $('#query').val();

    var request = baseURL + "/" + "search?q=" + q + "&part=snippet&order=rating&type=video&videoDefinition=high&videoEmbeddable=true&maxResults=1&key=" + apiKey;

    fetch(request)
    .then(function (response) {
        return response.json();
    })
    .then(function (data){
        $('#embedded-video').html('<iframe src="https://www.youtube.com/embed/' + data.items[0].id.videoId + '?autoplay=1&mute=1"></iframe>');
    });
}