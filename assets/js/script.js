// To minimize API Key exposure
const apiKey = "AIzaSyAZGbZ7QVBH072f46M34t148Rjpbdi3TPs";
const fetchURL = `https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=${apiKey}&part=snippet,contentDetails,statistics,status`;

var homePage = document.getElementById("mainCards");
var trendingPage = document.getElementById("trendingPage");
var searchHistory = document.getElementById("searchHistory");
var resetHistory = document.getElementById("resetHistory");
var userVideoList = document.querySelector("#recentUploadsYT");
const canvas = document.querySelector(".canvas");

// -------------------- Chart.js render --------------------
function createChart(userData) {
  if (!userData || !userData.items || userData.items.length === 0) {
    showErrorModal("Error: No data available for chart creation.");
    return;
  }

  // Make sure the container is visible
  if (canvas && canvas.classList.contains("hide")) {
    canvas.classList.replace("hide", "show");
  }

  // Clear previous chart and create a fresh <canvas>
  canvas.innerHTML = "";
  const uniqueNumber = Math.floor(Math.random() * 1000000);
  const newCanvas = document.createElement("canvas");
  newCanvas.id = uniqueNumber;
  canvas.append(newCanvas);

  const ctx = document.getElementById(uniqueNumber).getContext("2d");
  const stats = userData.items[0].statistics;

  const data = {
    labels: ["Views", "Uploads", "Subscribers"],
    datasets: [
      {
        label: "Channel Stats",
        data: [
          stats.viewCount,
          stats.videoCount,
          stats.subscriberCount,
        ],
        backgroundColor: ["rgb(0, 0, 255)", "rgb(0, 0, 255)", "rgb(0, 0, 255)"],
        minBarLength: 10,
        hoverOffset: 4,
      },
    ],
  };

  new Chart(ctx, { type: "bar", data });
}

// -------------------- Timestamp demo fetch (kept) --------------------
fetch(fetchURL)
  .then((data) => data.json())
  .then((data) => {
    const items = data.items || [];
    if (!items[0]) return;
    const publishedAt = items[0].snippet.publishedAt;

    const postedDate = Date.parse(publishedAt);
    const currentDate = new Date();
    const timelapsed = currentDate.getTime() - postedDate;

    let timeStorage = 0;
    let description = "";
    const timeUnits = [
      { unit: "years", divide: 60000 * 60 * 24 * 365 },
      { unit: "weeks", divide: 60000 * 60 * 24 * 7 },
      { unit: "days", divide: 60000 * 60 * 24 },
      { unit: "hours", divide: 60000 * 60 },
      { unit: "minutes", divide: 60000 },
    ];

    for (const u of timeUnits) {
      if (timelapsed > u.divide) {
        timeStorage = timelapsed / u.divide;
        description = u.unit;
      }
    }
  });

// -------------------- SEARCH button: fetch & display --------------------
const searchInputEl = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-button");

if (searchInputEl) {
  searchInputEl.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const user = searchInputEl.value.trim();
      if (!user) {
        showErrorModal("Please type a YouTube username.");
        return;
      }
      await getUserData(user);
    }
  });
}

// If you still have a <form id="search-form">, prevent default submit
const searchFormEl = document.querySelector("#search-form");
if (searchFormEl) {
  searchFormEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!searchInputEl) return;

    const user = searchInputEl.value.trim();
    if (!user) {
      showErrorModal("Please type a YouTube username.");
      return;
    }
    await getUserData(user);
  });
}

if (searchBtn && searchInputEl) {
  searchBtn.addEventListener("click", async () => {
    const user = searchInputEl.value.trim();
    if (!user) {
      showErrorModal("Please type a YouTube username.");
      return;
    }
    await getUserData(user);
  });
}

// -------------------- Fetch channel data (with fallback by channelId) --------------------
async function getUserData(userInput) {
  // 1) Try legacy username route
  const byUsername = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&forUsername=${encodeURIComponent(
    userInput
  )}&key=${apiKey}`;

  try {
    let userData = await (await fetch(byUsername)).json();

    // 2) If not found, search for a channel and then fetch by id
    if (!userData || !userData.items || userData.items.length === 0) {
      const searchEndpoint = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=1&q=${encodeURIComponent(
        userInput
      )}&key=${apiKey}`;
      const found = await (await fetch(searchEndpoint)).json();

      const channelId =
        found?.items?.[0]?.id?.channelId ||
        found?.items?.[0]?.snippet?.channelId;

      if (channelId) {
        const byId = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=${apiKey}`;
        userData = await (await fetch(byId)).json();
      }
    }

    if (!userData || !userData.items || userData.items.length === 0) {
      showErrorModal("User/channel not found. Try a different name.");
      return;
    }

    // Draw chart and fill UI
    createChart(userData);

    const channel = userData.items[0];
    const userVideos = channel.id;

    const avatar = document.querySelector("#avatarYT");
    if (avatar) avatar.setAttribute("src", channel.snippet.thumbnails?.default?.url || "");

    const userName = document.querySelector("#userNameYT");
    if (userName) userName.textContent = channel.snippet.title || userInput;

    const accountName = document.querySelector("#account");
    if (accountName) accountName.textContent = channel.snippet.customUrl || "";

    const views = document.querySelector("#viewCount");
    if (views) views.textContent = shortNum(parseInt(channel.statistics.viewCount || 0));

    const upload = document.querySelector("#uploadCount");
    if (upload) upload.textContent = shortNum(parseInt(channel.statistics.videoCount || 0));

    const followers = document.querySelector("#followers");
    if (followers) followers.textContent = shortNum(parseInt(channel.statistics.subscriberCount || 0));

    const joined = document.querySelector("#joinDate");
    if (joined) joined.textContent = formatDate(channel.snippet.publishedAt);

    getUserVideoList(userVideos);
  } catch (e) {
    console.error(e);
    showErrorModal("Network error while fetching user data.");
  }
}

// -------------------- Trending Top 5 (kept) --------------------
async function getTrendingData() {
  const popularVideos = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&key=${apiKey}`;
  let popularData = await (await fetch(popularVideos)).json();

  let fiveTrendingCards = document.querySelector(".trendingData");
  if (!fiveTrendingCards || !popularData.items) return;

  fiveTrendingCards.innerHTML = "";

  for (let i = 0; i < Math.min(5, popularData.items.length); i++) {
    let trendingCard = document.createElement("div");
    trendingCard.classList.add("media");
    fiveTrendingCards.append(trendingCard);

    let mediaLeft = document.createElement("div");
    mediaLeft.classList.add("media-left");
    let mediaContent = document.createElement("div");
    mediaContent.classList.add("media-content");
    let mediaRight = document.createElement("div");
    mediaRight.classList.add("media-right");

    let figure = document.createElement("figure");
    let image = document.createElement("img");
    let title = document.createElement("p");
    let videoLink = document.createElement("a");
    let linkButton = document.createElement("button");

    figure.classList.add("image", "is-62x62");
    let imageLink = `https://i.ytimg.com/vi/${popularData.items[i].id}/default.jpg`;
    image.setAttribute("src", imageLink);
    image.setAttribute("alt", "Video thumbnail");

    title.classList.add("title", "is-4");
    title.innerHTML = popularData.items[i].snippet?.localized?.title || popularData.items[i].snippet?.title || "Untitled";

    let trendingVideoLink = getVideoLink(popularData.items[i].id);
    videoLink.setAttribute("href", trendingVideoLink);
    videoLink.setAttribute("target", "_blank");
    linkButton.classList.add("button", "is-link", "is-light");
    linkButton.innerHTML = "Watch the video!";

    figure.append(image);
    videoLink.append(linkButton);
    mediaLeft.append(figure);
    mediaContent.append(title);
    mediaRight.append(videoLink);
    trendingCard.append(mediaLeft, mediaContent, mediaRight);
  }
}

// -------------------- Recent uploads list (kept) --------------------
async function getUserVideoList(userVideos) {
  const userVideosURl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${userVideos}&part=snippet,id&order=date&maxResults=10`;
  let userVideoData = await (await fetch(userVideosURl)).json();

  if (!userVideoList || !userVideoData.items) return;

  userVideoList.innerHTML = "";

  let firstVideoId = null;
  let firstVideoTitle = null;

  for (let i = 0; i < Math.min(10, userVideoData.items.length); i++) {
    const videoItem = userVideoData.items[i];
    const title = videoItem.snippet.title;
    const id = videoItem.id.videoId;

    const buttonEl = document.createElement("button");
    buttonEl.classList.add("button", "is-light", "is-fullwidth");
    buttonEl.innerHTML = title;
    buttonEl.setAttribute("id", id);
    userVideoList.append(buttonEl);

    // Store the first video to auto-fill the main section
    if (i === 0 && id) {
      firstVideoId = id;
      firstVideoTitle = title;
    }
  }

  // Auto-select the first video (same behavior as clicking its button)
  if (firstVideoId && firstVideoTitle) {
    const videoLink = getVideoLink(firstVideoId);
    getVideoData(firstVideoId);

    const videoTitleEl = document.querySelector("#videoTitle");
    if (videoTitleEl) videoTitleEl.textContent = firstVideoTitle;

    const buttonEl = document.querySelector("#videoLink");
    if (buttonEl) {
      buttonEl.setAttribute("href", videoLink);
      buttonEl.setAttribute("target", "_blank");
    }

    const thumbnailUrl = `https://i.ytimg.com/vi/${firstVideoId}/default.jpg`;
    const videoThumbnailEl = document.querySelector("#videoThumbnail");
    if (videoThumbnailEl) videoThumbnailEl.setAttribute("src", thumbnailUrl);
  }
}


// -------------------- Init: preload default + trending, render chart under first container --------------------
function init() {
  const defaultUser = "YouTube"; // default preload

  // Prefill the input and render default user's chart + stats
  const searchBar = document.querySelector("#search-input");
  if (searchBar) searchBar.value = defaultUser;

  getUserData(defaultUser); // draw chart on load under the first container
  getTrendingData();        // optional: keep trending section

  // Search History (load/display) remains separate — not triggered by SEARCH
  var users = readUsersFromStorage();
  if (users.length === 0) {
    users.push(defaultUser);
    saveUsersToStorage(users);
  }
  printSearchHistory(users);
}
init();

// -------------------- Helpers --------------------
function getVideoLink(videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

async function getVideoData(videoId) {
  var videoDataURL = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`;
  let videoData = await (await fetch(videoDataURL)).json();
  if (!videoData.items || !videoData.items[0]) return;

  var viewCount = document.querySelector("#viewCountVideo");
  var commentCount = document.querySelector("#uploadCountVideo");
  var likeCount = document.querySelector("#likesVideo");

  var formattedViewCount = shortNum(parseInt(videoData.items[0].statistics.viewCount));
  if (viewCount) viewCount.textContent = formattedViewCount;
  if (commentCount)
    commentCount.textContent = shortNum(parseInt(videoData.items[0].statistics.commentCount));
  if (likeCount)
    likeCount.textContent = shortNum(parseInt(videoData.items[0].statistics.likeCount));
}

if (searchHistory) {
  searchHistory.addEventListener("click", function (event) {
    event.preventDefault();
    var element = event.target;
    var historyUser = element.innerHTML;
    getUserData(historyUser);
    if (canvas) canvas.classList.replace("hide", "show");
  });
}

if (resetHistory) {
  resetHistory.addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.clear();
    var users = readUsersFromStorage();
    printSearchHistory(users);
    if (canvas) canvas.classList.replace("show", "hide");
  });
}

function readUsersFromStorage() {
  var users = localStorage.getItem("users");
  if (users) {
    users = JSON.parse(users);
  } else {
    users = [];
  }
  return users;
}

function saveUsersToStorage(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function printSearchHistory(users) {
  users = users.filter((user, index) => users.indexOf(user) === index);
  if (!searchHistory) return;
  searchHistory.innerHTML = "";
  users = users.splice(0, 8);

  for (let i = 0; i < users.length; i++) {
    var buttonEl = document.createElement("button");
    buttonEl.classList.add("button", "is-fullwidth", "is-light");
    buttonEl.setAttribute("type", "button");
    buttonEl.innerHTML = `${users[i]}`;
    searchHistory.append(buttonEl);
  }
}

// Show Date As MM/DD/YY
function formatDate(numString) {
  const options = { year: "2-digit", month: "2-digit", day: "2-digit" };
  return new Date(numString).toLocaleDateString(undefined, options);
}

// Short number format
function shortNum(number) {
  const symbols = ["", " K", " M", " B", " T"];
  const tier = (Math.log10(Math.abs(number)) / 3) | 0;
  const roundedNumber = (number / Math.pow(1000, tier)).toFixed(3);
  const formattedNumber = parseFloat(roundedNumber).toString();
  return formattedNumber + symbols[tier];
}

// Error modal (fallbacks to alert if modal isn't in DOM)
function showErrorModal(errorMessage) {
  var modal = document.getElementById("errorModal");
  var messageElement = document.getElementById("errorMessage");

  if (!modal || !messageElement) {
    alert(errorMessage);
    return;
  }

  messageElement.textContent = errorMessage;
  modal.style.display = "block";

  var closeBtn = document.querySelector(".close");
  if (closeBtn) {
    closeBtn.onclick = function () {
      modal.style.display = "none";
    };
  }
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}