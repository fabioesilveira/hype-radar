var fetchURL = `https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=AIzaSyBE4-QzODzzAapaJHBTHgNAaq2vjRXw8-0&part=snippet,contentDetails,statistics,status`;

var homePage = document.getElementById("mainCards");
var trendingPage = document.getElementById("trendingPage");
var searchHistory = document.getElementById("searchHistory");

var userVideoList = document.querySelector('#recentUploadsYT');

// Timestamp Fetch
fetch(fetchURL)
  .then((data) => data.json())
  .then((data) => {
    // Get data from API
    const items = data.items;
    const firstItem = items[0];
    const publishedAt = firstItem.snippet.publishedAt;

    // Get the Dates
    const postedDate = Date.parse(publishedAt);
    const currentDate = new Date();

    // Get the Milliseconds
    const timelapsed = currentDate.getTime() - postedDate;

    let timeStorage = 0;
    let description = "";

    // The Math
    const timeUnits = [
      { unit: "years", divide: 60000 * 60 * 24 * 365 },
      { unit: "weeks", divide: 60000 * 60 * 24 * 7 },
      { unit: "days", divide: 60000 * 60 * 24 },
      { unit: "hours", divide: 60000 * 60 },
      { unit: "minutes", divide: 60000 },
    ];

    for (const data of timeUnits) {
      if (timelapsed > data.divide) {
        timeStorage = timelapsed / data.divide;
        description = data.unit;
      }
    }

    // Round Numbers
    let wholeNum = Math.trunc(timeStorage);

    console.log(data);
    console.log(timelapsed);
    console.log(wholeNum, description);
  });

//getData();

// function (){
//     var worldTimeAPIkey = "cifLc8RbKUl7kVs7tqJ2xg==gFT6OiooBMdW3P7d";

//     fetch(api)

// }

var searchFormEl = document.querySelector("#search-form");

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var userInput = document.querySelector("#search-input").value;

  if (!userInput) {
    console.error("User not found, please try another");
    return;
  }

  console.log(userInput);
  // Empty search bar
  const searchBar = document.querySelector("#search-input");
  searchBar.value = "";

  var users= readUsersFromStorage();
  users.unshift(userInput);
  saveUsersToStorage(users);
  printSearchHistory(users);

  getUserData(userInput);
}

searchFormEl.addEventListener("submit", handleSearchFormSubmit);

async function getUserData(userInput) {
  var searchByUsername =
    "https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&forUsername=" +
    userInput +
    "&key=AIzaSyBE4-QzODzzAapaJHBTHgNAaq2vjRXw8-0";

  let userData = await (await fetch(searchByUsername)).json(); //wait for the data and wait for the json
  console.log(userData);

  var userVideos = userData.items[0].id;
  console.log(userVideos);

  // Account Display
  const avatar = document.querySelector("#avatarYT");
  avatar.setAttribute("src", userData.items[0].snippet.thumbnails.default.url);

  const userName = document.querySelector("#userNameYT");
  userName.textContent = userData.items[0].snippet.title;

  const accountName = document.querySelector("#account");
  accountName.textContent = userData.items[0].snippet.customUrl;

  // Stats Display
  const views = document.querySelector("#viewCount");
  views.textContent = parseInt(
    userData.items[0].statistics.viewCount
  ).toLocaleString(); // Format the number with commas

  const upload = document.querySelector("#uploadCount");
  upload.textContent = parseInt(
    userData.items[0].statistics.videoCount
  ).toLocaleString(); // Format the number with commas

  const followers = document.querySelector("#followers");
  followers.textContent = parseInt(
    userData.items[0].statistics.subscriberCount
  ).toLocaleString(); // Format the number with commas

  const joined = document.querySelector("#joinDate");
  joined.textContent = userData.items[0].snippet.publishedAt.substring(0, 10); // Format is YYYY-MM-DD

  getUserVideoList(userVideos);
}

async function getTrendingData() {
  var popularVideos =
    "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&key=AIzaSyBE4-QzODzzAapaJHBTHgNAaq2vjRXw8-0";

  let popularData = await (await fetch(popularVideos)).json(); //wait for the data and wait for the json

  console.log(popularData);

  var fiveTrendingCards = document.querySelector(".trendingData");

    //create five cards that hold the top five trending data videos and information
  for(let i = 0; i < 5; i++) {
    var trendingCard = document.createElement('div');
    trendingCard.classList.add('media');

    fiveTrendingCards.append(trendingCard);

    //create all necessary elements
    var mediaLeft = document.createElement('div');
    mediaLeft.classList.add('media-left');
    var mediaContent = document.createElement('div');
    mediaContent.classList.add('media-content');
    var mediaRight = document.createElement('div');
    mediaRight.classList.add('media-right');

    var figure = document.createElement('figure');
    var image = document.createElement('img');
    var title = document.createElement('p');
    var videoLink = document.createElement('a');
    var linkButton = document.createElement('button');

    //add classes and attributes to elements
    figure.classList.add("image", "is-62x62");
    var imageLink = 'https://i.ytimg.com/vi/'+ popularData.items[i].id +'/default.jpg'
    image.setAttribute("src", imageLink);
    image.setAttribute("alt","Placeholder image");

    title.classList.add("title", "is-4");
    title.innerHTML = popularData.items[i].snippet.localized.title;

    var trendingVideoLink = getVideoLink(popularData.items[i].id);
    videoLink.setAttribute("href", trendingVideoLink);
    videoLink.setAttribute("target", "_blank");
    linkButton.classList.add("button", "is-link", "is-light");
    linkButton.innerHTML = "Watch the video!";

    //append elements to appropriate locations
    figure.append(image);
    videoLink.append(linkButton);

    mediaLeft.append(figure);
    mediaContent.append(title);
    mediaRight.append(videoLink);

    trendingCard.append(mediaLeft, mediaContent, mediaRight);

  }
}

async function getUserVideoList(userVideos) {
  
    var userVideosURl = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyBE4-QzODzzAapaJHBTHgNAaq2vjRXw8-0&channelId=` + userVideos + `&part=snippet,id&order=date&maxResults=10`;

    let userVideoData = await (await fetch(userVideosURl)).json();

    console.log(userVideoData);

    userVideoList.innerHTML = ""

    //create ten buttons for the most recent uploads from the user
    for(let i = 0; i < 10; i++) {
        var buttonEl = document.createElement('button');
        buttonEl.classList.add('button','is-light', 'is-fullwidth');
        //buttonEl.setAttribute('type', 'button');
        buttonEl.textContent = userVideoData.items[i].snippet.title;
        buttonEl.setAttribute('id', userVideoData.items[i].id.videoId);
        userVideoList.append(buttonEl);
    }

}

userVideoList.addEventListener("click", function(event) {
    event.preventDefault();
    var element = event.target;

    var videoSelected = element.innerHTML;
    var idSelected = element.id;
    console.log(videoSelected);
    console.log(idSelected);

    //get video link and print individual video data from video Id
    var videoLink = getVideoLink(idSelected);
    getVideoData(idSelected);

    console.log(videoLink);

    //print video data to dom
    var videoTitle = document.querySelector('#videoTitle');
    videoTitle.textContent = videoSelected;

    var buttonEl = document.querySelector('#videoLink');
    buttonEl.setAttribute('href', videoLink);
    buttonEl.setAttribute("target", "_blank");

    var thumbnailUrl = 'https://i.ytimg.com/vi/'+ idSelected + '/default.jpg';
    var videoThumbnailUrl = document.querySelector('#videoThumbnail');
    videoThumbnailUrl.setAttribute("src", thumbnailUrl);
})

function init() {
  getTrendingData();

  var users= readUsersFromStorage();
  printSearchHistory(users);
}

init();

function getVideoLink(videoId) {
  var videoLink = `https://www.youtube.com/watch?v=${videoId}`;
  return videoLink;
} //function creates link to watch video from video Id

async function getVideoData(videoId) {

    var videoDataURL = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=`+ videoId +`&key=AIzaSyBE4-QzODzzAapaJHBTHgNAaq2vjRXw8-0`;

    let videoData = await (await fetch(videoDataURL)).json();

    console.log(videoData);

    var viewCount = document.querySelector("#viewCountVideo");
    var commentCount = document.querySelector("#uploadCountVideo");
    var likeCount = document.querySelector("#likesVideo");

    viewCount.textContent = parseInt(videoData.items[0].statistics.viewCount).toLocaleString();
    commentCount.textContent = parseInt(videoData.items[0].statistics.commentCount).toLocaleString();
    likeCount.textContent = parseInt(videoData.items[0].statistics.likeCount).toLocaleString();
}//gets individual video data and prints it to DOM

searchHistory.addEventListener("click", function(event) {
    event.preventDefault();
    var element = event.target;

    var historyUser = element.innerHTML;

    getUserData(historyUser);

    //put dom manipulation here
})//provides function for search history buttons

//put reset history button event listener

function readUsersFromStorage() {
  var users = localStorage.getItem('users');
  if (users) {
    users = JSON.parse(users);
  } else {
    users = [];
  }
  console.log(users);
  return users;
}//reads users from storage


function saveUsersToStorage(users) {
  localStorage.setItem('users', JSON.stringify(users));
}// Takes an array of projects and saves them in localStorage.

function printSearchHistory(users) {
  //print so they are present at page load
  searchHistory.innerHTML = ""

  users = users.splice(0, 8);
  console.log(users);

  for(let i = 0; i < users.length; i++) {
    var buttonEl = document.createElement('button');
    buttonEl.classList.add('button', 'is-fullwidth', 'is-light');
    buttonEl.setAttribute('type', 'button');
    buttonEl.innerHTML = `${users[i]}`;

    searchHistory.append(buttonEl);
  }
}//prints search history buttons to DOM
