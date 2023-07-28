var fetchURL = `https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=AIzaSyBE4-QzODzzAapaJHBTHgNAaq2vjRXw8-0&part=snippet,contentDetails,statistics,status`;

// async function getData() {
//     let current = await (await fetch(fetchURL)).json();//wait for the data and wait for the json

//     console.log(current);

// }

fetch(fetchURL)
  .then((data) => data.json())
  .then((data) => console.log(data));

//getData();
