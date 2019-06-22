var express = require("express");
var app = express();
var request = require("request");

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    
    res.render("home");
});

app.get("/results", function(req, res){
    var query = req.query.search;
    for(var i = 0; i < query.length; i++){
      if(query[i] == " "){
          query[i] == "%20";
      }  
    }
    // var url = "http://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=61763259e53e52a53cbb7856e3b8b932&units=metric";
    var app_key = process.env.APPID;
    var url = "http://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid="+ app_key + "&units=metric";
    request(url, function(error, response, body){
        if(!error && response.statusCode == 200) {
           var data = JSON.parse(body);
           res.render("results", {data: data});
           
       }
       else {
           res.send("ERROR");
       }
    });
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("The Server Has Started!");
});

// app.listen(process.env.PORT, process.env.IP, function(){
//    console.log("Server Has Started");
// });