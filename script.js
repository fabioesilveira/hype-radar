var fetchURL = `https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=AIzaSyBE4-QzODzzAapaJHBTHgNAaq2vjRXw8-0&part=snippet,contentDetails,statistics,status`

//fetch(fetchURL).then(data => data.json()).then(data => console.log(data));


var searchFormEl = document.querySelector('#search-form');

function handleSearchFormSubmit(event) {
    event.preventDefault();
  
    var userInput = document.querySelector('#search-input').value;
  
    if (!userInput) {
      console.error('User not found, please try another');
      return;
    }

    console.log(userInput);

    getUserData(userInput);

  }

  searchFormEl.addEventListener('submit', handleSearchFormSubmit);


  async function getUserData(userInput) {

    var searchByUsername = "https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&forUsername=" + userInput + "&key=AIzaSyBE4-QzODzzAapaJHBTHgNAaq2vjRXw8-0"
    
    let userData = await (await fetch(searchByUsername)).json();//wait for the data and wait for the json

    console.log(userData);

    var userVideos = userData.items[0].id;

    console.log(userVideos);

    getUserVideoList(userVideos);

}

async function getTrendingData() {

    var popularVideos = "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&key=AIzaSyBE4-QzODzzAapaJHBTHgNAaq2vjRXw8-0";

    let popularData = await (await fetch(popularVideos)).json();//wait for the data and wait for the json

    console.log(popularData);

}

async function getUserVideoList(userVideos) {

    var userVideosURl = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyBE4-QzODzzAapaJHBTHgNAaq2vjRXw8-0&channelId=` + userVideos + `&part=snippet,id&order=date&maxResults=20`;

    let userVideoData = await (await fetch(userVideosURl)).json();

    console.log(userVideoData);

}

function init() {
    getTrendingData();
}

init();

function getVideoLink(videoId) {

    var videoLink = `https://www.youtube.com/watch?v=${videoId}`;

    return videoLink;

}





