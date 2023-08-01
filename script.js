var fetchURL = `https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=AIzaSyBE4-QzODzzAapaJHBTHgNAaq2vjRXw8-0&part=snippet,contentDetails,statistics,status`;

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
  avatar.mediaContent = userData.items[0].snippet.thumbnails.default.url;

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
}

async function getUserVideoList(userVideos) {
  var userVideosURl =
    `https://www.googleapis.com/youtube/v3/search?key=AIzaSyBE4-QzODzzAapaJHBTHgNAaq2vjRXw8-0&channelId=` +
    userVideos +
    `&part=snippet,id&order=date&maxResults=20`;

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
