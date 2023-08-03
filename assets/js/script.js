// To minimize API Key exposure
const apiKey = "AIzaSyAZGbZ7QVBH072f46M34t148Rjpbdi3TPs";
const fetchURL = `https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=${apiKey}&part=snippet,contentDetails,statistics,status`;

var homePage = document.getElementById("mainCards");
var trendingPage = document.getElementById("trendingPage");
var searchHistory = document.getElementById("searchHistory");
var resetHistory = document.getElementById("resetHistory");
var userVideoList = document.querySelector("#recentUploadsYT");
const canvas = document.querySelector(".canvas");

function createChart(userData) {
  // Check if userData and userData.items exist and is not empty
  if (!userData || !userData.items || userData.items.length === 0) {
    showErrorModal("Error: No data available for chart creation.");
    return;
  }

  canvas.innerHTML = "";

  const uniqueNumber = Math.floor(Math.random() * 1000000);

  const newCanvas = document.createElement("canvas");
  newCanvas.id = uniqueNumber;
  canvas.append(newCanvas);

  const ctx = document.getElementById(uniqueNumber).getContext("2d");

  const data = {
    labels: ["Views", "Uploads", "Subscribers"],
    datasets: [
      {
        label: "My First Dataset",
        data: [
          userData.items[0].statistics.viewCount,
          userData.items[0].statistics.videoCount,
          userData.items[0].statistics.subscriberCount,
        ],
        backgroundColor: ["rgb(0, 0, 255)", "rgb(0, 0, 255)", "rgb(0, 0, 255)"],
        minBarLength: 10,
        hoverOffset: 4,
      },
      {
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      },
    ],
  };

  new Chart(ctx, {
    type: "bar",
    data: data,
  });
}

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

var searchFormEl = document.querySelector("#search-form");

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var userInput = document.querySelector("#search-input").value;

  if (!userInput) {
    showErrorModal("User not found, please try another"); // Switch console.log to modal
    return;
  }

  console.log(userInput);
  // Empty search bar
  const searchBar = document.querySelector("#search-input");
  searchBar.value = "";

  var users = readUsersFromStorage();
  users.unshift(userInput);
  saveUsersToStorage(users);
  printSearchHistory(users);

  getUserData(userInput);
}

searchFormEl.addEventListener("submit", handleSearchFormSubmit);

async function getUserData(userInput) {
  var searchByUsername = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&forUsername=${userInput}&key=${apiKey}`;

  let userData = await (await fetch(searchByUsername)).json(); //wait for the data and wait for the json
  console.log(userData);

  // Check if userData and userData.items exist and is not empty
  if (!userData || !userData.items || userData.items.length === 0) {
    showErrorModal(
      "User data not found. Please check the username and try again."
    );
    return;
  }

  createChart(userData);

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
  views.textContent = shortNum(
    parseInt(userData.items[0].statistics.viewCount)
  );

  const upload = document.querySelector("#uploadCount");
  upload.textContent = shortNum(
    parseInt(userData.items[0].statistics.videoCount)
  );

  const followers = document.querySelector("#followers");
  followers.textContent = shortNum(
    parseInt(userData.items[0].statistics.subscriberCount)
  );

  // Change the format of the JoinDate
  const joined = document.querySelector("#joinDate");
  const formattedJoinDate = formatDate(userData.items[0].snippet.publishedAt);
  joined.textContent = formattedJoinDate;

  getUserVideoList(userVideos);
}

async function getTrendingData() {
  var popularVideos = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&key=${apiKey}`;

  let popularData = await (await fetch(popularVideos)).json(); //wait for the data and wait for the json

  console.log(popularData);

  var fiveTrendingCards = document.querySelector(".trendingData");

  //create five cards that hold the top five trending data videos and information
  for (let i = 0; i < 5; i++) {
    var trendingCard = document.createElement("div");
    trendingCard.classList.add("media");

    fiveTrendingCards.append(trendingCard);

    //create all necessary elements
    var mediaLeft = document.createElement("div");
    mediaLeft.classList.add("media-left");
    var mediaContent = document.createElement("div");
    mediaContent.classList.add("media-content");
    var mediaRight = document.createElement("div");
    mediaRight.classList.add("media-right");

    var figure = document.createElement("figure");
    var image = document.createElement("img");
    var title = document.createElement("p");
    var videoLink = document.createElement("a");
    var linkButton = document.createElement("button");

    //add classes and attributes to elements
    figure.classList.add("image", "is-62x62");
    var imageLink =
      "https://i.ytimg.com/vi/" + popularData.items[i].id + "/default.jpg";
    image.setAttribute("src", imageLink);
    image.setAttribute("alt", "Placeholder image");

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
  var userVideosURl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${userVideos}&part=snippet,id&order=date&maxResults=10`;

  let userVideoData = await (await fetch(userVideosURl)).json();

  console.log(userVideoData);

  userVideoList.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    var buttonEl = document.createElement("button");
    buttonEl.classList.add("button", "is-light", "is-fullwidth");
    // Use innerHTML instead of textContent to turn &quot into quotation marks;
    buttonEl.innerHTML = userVideoData.items[i].snippet.title;
    buttonEl.setAttribute("id", userVideoData.items[i].id.videoId);
    userVideoList.append(buttonEl);
  }
}

userVideoList.addEventListener("click", function (event) {
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
  var videoTitle = document.querySelector("#videoTitle");
  videoTitle.textContent = videoSelected;

  var buttonEl = document.querySelector("#videoLink");
  buttonEl.setAttribute("href", videoLink);
  buttonEl.setAttribute("target", "_blank");

  var thumbnailUrl = "https://i.ytimg.com/vi/" + idSelected + "/default.jpg";
  var videoThumbnailUrl = document.querySelector("#videoThumbnail");
  videoThumbnailUrl.setAttribute("src", thumbnailUrl);
});

function init() {
  getTrendingData();

  var users = readUsersFromStorage();
  printSearchHistory(users);
}

init();

function getVideoLink(videoId) {
  var videoLink = `https://www.youtube.com/watch?v=${videoId}`;
  return videoLink;
}

async function getVideoData(videoId) {
  var videoDataURL = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`;

  let videoData = await (await fetch(videoDataURL)).json();

  console.log(videoData);

  var viewCount = document.querySelector("#viewCountVideo");
  var commentCount = document.querySelector("#uploadCountVideo");
  var likeCount = document.querySelector("#likesVideo");

  // Convert view count to a more readable format using shortNum function
  var formattedViewCount = shortNum(
    parseInt(videoData.items[0].statistics.viewCount)
  );

  viewCount.textContent = formattedViewCount;
  commentCount.textContent = shortNum(
    parseInt(videoData.items[0].statistics.commentCount)
  );
  likeCount.textContent = shortNum(
    parseInt(videoData.items[0].statistics.likeCount)
  );
} //gets individual video data and prints it to DOM

searchHistory.addEventListener("click", function (event) {
  event.preventDefault();
  var element = event.target;

  var historyUser = element.innerHTML;

  getUserData(historyUser);
  canvas.classList.replace("hide", "show");
}); //provides function for search history buttons

resetHistory.addEventListener("click", function (event) {
  event.preventDefault();

  localStorage.clear();
  var users = readUsersFromStorage();
  printSearchHistory(users);
  canvas.classList.replace("show", "hide");
});

function readUsersFromStorage() {
  var users = localStorage.getItem("users");
  if (users) {
    users = JSON.parse(users);
  } else {
    users = [];
  }
  console.log(users);
  return users;
} //reads users from storage

function saveUsersToStorage(users) {
  localStorage.setItem("users", JSON.stringify(users));
} // Takes an array of projects and saves them in localStorage.

function printSearchHistory(users) {
  users = users.filter((user, index) => users.indexOf(user) === index); // Remove duplicate elements from the 'users' array
  //print so they are present at page load
  searchHistory.innerHTML = "";

  users = users.splice(0, 8);
  console.log(users);

  for (let i = 0; i < users.length; i++) {
    var buttonEl = document.createElement("button");
    buttonEl.classList.add("button", "is-fullwidth", "is-light");
    buttonEl.setAttribute("type", "button");
    buttonEl.innerHTML = `${users[i]}`;

    searchHistory.append(buttonEl);
  }
} //prints search history buttons to DOM

// Show Date As MM/DD/YY
function formatDate(numString) {
  const options = { year: "2-digit", month: "2-digit", day: "2-digit" };
  return new Date(numString).toLocaleDateString(undefined, options);
}

// Convert a large number into a more readable format
function shortNum(number) {
  const symbols = ["", " K", " M", " B", " T"];
  // Calculate the tier of the number
  const tier = (Math.log10(Math.abs(number)) / 3) | 0;
  const roundedNumber = (number / Math.pow(1000, tier)).toFixed(3);

  // Remove trailing zeroes after the decimal point
  const formattedNumber = parseFloat(roundedNumber).toString();

  return formattedNumber + symbols[tier];
}

// Function to show the error modal
function showErrorModal(errorMessage) {
  var modal = document.getElementById("errorModal");
  var messageElement = document.getElementById("errorMessage");

  messageElement.textContent = errorMessage; // Updates error message displayed in the modal
  modal.style.display = "block"; // The modal visible on the screen

  var closeBtn = document.querySelector(".close");
  closeBtn.onclick = function () {
    modal.style.display = "none";
  }; // Modal is hidden when the close button is clicked

  // Close the modal when clicking anywhere outside the content
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}
