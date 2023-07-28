var fetchURL = `https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=AIzaSyBE4-QzODzzAapaJHBTHgNAaq2vjRXw8-0&part=snippet,contentDetails,statistics,status`;

async function getData() {
  let current = await (await fetch(fetchURL)).json(); //wait for the data and wait for the json

  console.log(current);
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
