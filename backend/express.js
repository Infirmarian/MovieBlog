const express = require("express");
const md5 = require("md5");
const firebase = require('./firebase.js');

var bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(__dirname + '/public'));


app.post("/auth/login", async (req, res) => {
    var hpwd = md5(req.body.password);
    var un = req.body.username.toLowerCase();
    
    const result = await firebase.validUser(un, hpwd);
    if(result === 0){
        console.log(`User ${un} logged in at ${new Date().toString()}`);
        // OAUTH
        var token =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        var exp = 3600;
        firebase.addTempToken(token, un, exp);

        res.status(200).json({
            "access_token":token,
            "token_type":"bearer",
            "expires_in":exp,
            "username":un
        });
    }else{
        console.log("Incorrect username and password");
        res.status(403).json({"ErrorCode":"Invalid Request"});
    }
});

app.post("/auth/register", async (req, res)=>{
    var hpwd = md5(req.body.password);
    var un = req.body.username.toLowerCase();
    try{
        var result = await firebase.addUser(un, hpwd);
        if(result != 0){
            res.status(200).json({"ErrorStatus":result});
        }else{
            console.log(`Created user ${un} at ${new Date().toString()}`);
            res.status(200).json({"ErrorStatus":0,"Success":true});
        }
    }catch(e){
        console.log("Error registering user: "+e);
    }
});

//logs a user out
app.post("/auth/logout", async (req, res)=>{
    var un = req.body.username;
    await firebase.logout(un);
    res.status(200).json({"logged out":true});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

