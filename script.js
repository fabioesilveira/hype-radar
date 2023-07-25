var apiKey = "AIzaSyBE4-QzODzzAapaJHBTHgNAaq2vjRXw8-0"
var apiCall = "https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=" + apiKey + "&part=snippet,contentDetails,statistics";
var apiUserName = "https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&forUsername=GoogleDevelopers&key=" + apiKey;



fetch(apiUserName)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        console.log(data)
    })