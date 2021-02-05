const express = require("express");
const app = express();
const axios = require('axios');
const helper = require("./utility/helper");
require("dotenv").config();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("home");
});

app.get("/results", function(req, res){
    var query = req.query.search;
    
    axios.get('https://api.opencagedata.com/geocode/v1/json?key='+ process.env.OPENCAGEDATA_ID +'&q=' + encodeURIComponent(query))
    .then(response => {
      // handle success
      location = response.data.results[0].geometry;
      const url = 'https://api.openweathermap.org/data/2.5/onecall?lat='+ location.lat +'&lon='+ location.lng +'&exclude=minutely,hourly,alerts&appid=' + process.env.OPENWEATHER_ID + '&units=metric'; 
      axios.get(url)
      .then(weatherData => {
        res.render('results', {data: weatherData.data, location: helper.toTitleCase(query)});
      })
      .catch(error => {
        // handle error
        console.log(error);
      })
    })
    .catch(error => {
      // handle error
      console.log(error);
    })
});

app.listen(process.env.PORT, function () {
    console.log("The server has started on port " + process.env.PORT);
});