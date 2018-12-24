const express = require("express");
const md5 = require("md5");
const fs = require('fs');

var bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(__dirname + '/public'));


app.post("/auth", (req, res) => {
    var hpwd = md5(req.body.password);
    var un = req.body.username;

    // load users from javascript file
    var users = JSON.parse(fs.readFileSync('user.json', 'utf8'));
    
    if(un in users && users[un]["password"] === hpwd){
        console.log("successfully logged in");
        res.status(200).json({valid:true});
    }else{
        console.log(req.body);
        console.log("Incorrect username and password");
        res.status(200).json({valid:false});
    }
});

app.get("/index", (req, res)=>{
    res.send("<h1>Yay, logged in!</h1>");
})

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

