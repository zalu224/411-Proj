const express = require("express");
const app = express();
const request = require("request");
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/* 
* this is a backend of a decoupled project where we take a string from the front end
* and send it to the backend to make an api call then the json object back to the front end
*
*/
// API call using the string from front end and make call to calorieninjas api


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
