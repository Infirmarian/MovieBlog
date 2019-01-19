const express = require("express");
const md5 = require("md5");
const firebase = require('./firebase.js');

var bodyParser = require("body-parser");
const app = express();
const port = 5000;

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(__dirname + '/public'));


app.get("/express_backend", (req, res) => {
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
})

/////////////////////////////////////////////////////
/////// User authentication (login, logout, register)
/////////////////////////////////////////////////////
// Expected input: {"username":username, "password":password}
// Output: {"access_token":token, "token_type":"bearer", "expires_in":int, "username":username}
app.post("/auth/login", async (req, res) => {
    console.log(req.body.key);
    var hpwd = md5(req.body.password);
    var un = req.body.username.toLowerCase();
    try{
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
    }catch (e){
        console.log(`Error logging in user ${un}`);
    }
});
// register a new user
// returns a non-zero ErrorStatus if there was an issue
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
// logs a user out
// invalidates a logged in user by removing their token from the database
app.post("/auth/logout", async (req, res)=>{
    var token = req.body.token;
    await firebase.logout(token);
    res.status(200).json({"logged out":true});
});

/////////////////////////////////////////////////////
//////// Post Creation and Modification
/////////////////////////////////////////////////////
// Expected input: {"token":token, "title":title, "body":body, "rating":2}
// Output: {"ok":true, "ErrorCode":0, "ErrorMessage": "None"};
app.post("/create_post", async (req, res) =>{
    var token = req.body.token;
    var auth_result = firebase.isValidToken(token)
    if(!auth_result.valid){
        res.status(401).json({"ok":false, "ErrorCode":1, "ErrorMessage":"Invalid token was passed in, please log in again"})
    }
    var user = auth_result.username;
    var body = req.body.body;
    var title = req.body.title;
    var rating = req.body.rating;
    try{
    var result = await firebase.addReviewToDatabase(user, title, body, rating);
    if(result != 0){
        res.status(200).json({"ErrorCode":result, "ok":false, "ErrorMessage":"Unknown error"});
    }else{
        console.log(`Created post for user ${user} at ${new Date().toString()}`);
        res.status(200).json({"ErrorCode":0,"ok":true, "ErrorMessage":""});
    }
    }catch(e){
        console.log("Error creating new post: "+e);
    } 
});
// get a post
// {"token":token, "cursor":0}
// {"posts":[{"title":title, "body":body, "rating":2}], "ok":true, "cursor":1}
app.get("/get_post", async (req, res) =>{
res.status(200).json({"ok":true, "posts":[{"title":"It's a wonderful life", "body":"Good movie, feeling happy/sad rn.", "rating":5}], "cursor":1});
});


app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

