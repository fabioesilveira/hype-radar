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
    if (timelapsed > 60000) {
      const minutes = timelapsed / 60000;
      //   console.log("minutes", minutes);
      timeStorage = minutes;
      description = "minutes";
    }

    if (timelapsed > 60000 * 60) {
      const hours = timelapsed / 60000 / 60;
      //   console.log("hours", hours);
      timeStorage = hours;
      description = "hours";
    }

    if (timelapsed > 60000 * 60 * 24) {
      const days = timelapsed / 60000 / 60 / 24;
      //   console.log("days", days);
      timeStorage = days;
      description = "days";
    }

    if (timelapsed > 60000 * 60 * 24 * 7) {
      const weeks = timelapsed / 60000 / 60 / 24 / 7;
      //   console.log("weeks", weeks);
      timeStorage = weeks;
      description = "weeks";
    }

    if (timelapsed > 60000 * 60 * 24 * 365) {
      const years = timelapsed / 60000 / 60 / 24 / 365;
      //   console.log("years", years);
      timeStorage = years;
      description = "years";
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
