//login.js

var form = document.getElementById("login");
var submit = document.getElementById("submit");

//makes sure that the username and password aren't blank
function checkBlank(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    return(password === "" || username === "");
}
form.onsubmit = function() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200){
            if(! JSON.parse(xhttp.responseText).valid){
                document.getElementById("wrongPassword").innerHTML = "Incorrect username or password!";
                document.getElementById("password").value = "";
            }else{
                // valid user
                console.log("valid user");
                document.location.href = "index";
            }
        }
      };


    if(checkBlank()){
        alert("Username and password must not be blank");
        return false;
    }else{
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        xhttp.open("POST", "/auth", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(`username=${username}&password=${password}`);
        return false;
    }
};
