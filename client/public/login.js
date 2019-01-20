//login.js

var form = document.getElementById("login");
//var submit = document.getElementById("submit");

//makes sure that the username and password aren't blank
function checkBlank(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    return(password === "" || username === "");
}
form.onsubmit = function() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4){
            if(xhttp.status == 403){
                console.log(xhttp.responseText);
                //document.getElementById("wrongPassword").innerHTML = "Incorrect username or password!";
                var popup = document.getElementById("myPopup");
                popup.classList.toggle("show");
                document.getElementById("password").value = "";
            }else if(xhttp.status == 200){
                // valid user
                console.log("valid user");
                var resp = JSON.parse(xhttp.responseText);
                //expiration date functions
                var d = new Date();
                d.setTime(d.getTime()+(resp.expires_in*1000));
                document.cookie = `token=${resp.access_token};expires=${d.toGMTString()};path=/;`
                document.cookie = `username=${resp.username};expires=${d.toGMTString()};path=/;`
                document.location.href = "index.html";
            }
        }
      };


    if(checkBlank()){
        alert("Username and password must not be blank");
        return false;
    }else{
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        console.log(`Username:${username}`);
        xhttp.open("POST", "/auth/login", true);
        xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify({"username":username, "password":password}));
        return false;
    }
};

function getCookie(cookieName){
    const co = document.cookie;
    var split = co.split(";");
    for(var i = 0; i<split.length; i++){
        var c = split[i];
        //trim whitespace
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(cookieName) == 0) {
          return c.substring(cookieName.length+1, c.length);
        }
    }
    //no cookies found
    return null;
}
if(getCookie("token") !== null){
    document.location.href = "index.html";
}
