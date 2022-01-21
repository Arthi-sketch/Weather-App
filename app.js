const express= require("express");
const app = express();

const bp= require("body-parser");
app.use(bp.urlencoded({extended: true}));

const ejs= require("ejs");
app.set('view engine', 'ejs');
app.use(express.static("public"));
const favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/fav.ico'));

const https=require("https");

let location="";
let celcius="0";
let humidity="0";
let condition="~";
let icon="";

app.get("/", function(req,res)
{
    res.setHeader("Content-Type", "text/html");
    res.setHeader('X-Foo', 'bar');
    res.render("index", {loc: location, temp: celcius, hum: humidity, cond: condition, ic: icon });
});

app.post("/", function(req,res)
{
    
    let url="https://api.openweathermap.org/data/2.5/weather?appid=bc88a264c0c6a88fb26cb6a56eddc09a&units=metric&q="+ req.body.city;
    
    https.get(url, function(response)
    {
        if(response.statusCode===200){
        response.on("data", function(data)
        {
            const report=JSON.parse(data);
            condition=report.weather[0].main;
            celcius=report.main.temp;
            humidity=report.main.humidity;
            location=report.name;
            icon= "http://openweathermap.org/img/wn/" +  report.weather[0].icon+ "@2x.png";
            console.log(condition)
            console.log(celcius);
            console.log(humidity);
            console.log(location);
            
            res.redirect("/");
        });
        }
        else 
        {
            location="Invalid city name";
            celcius="0";
            humidity="0";
            condition="~";
            icon="";
            res.redirect("/");
        }
    });
    
});

app.listen(process.env.PORT || 3000, function()
{
    console.log("server has been pushed");
})