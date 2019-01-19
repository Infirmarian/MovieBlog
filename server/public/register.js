//register.js
var form = document.getElementById("register");

function checkBlankAndValidate(u, p1, p2){
    var error = document.getElementById("error");
    if(u === ""){
        error.innerHTML = "Username must not be blank";
        return false;
    }
    if(p1 === ""){
        error.innerHTML = "Password must not be blank";
        return false;
    }
    if(p1 != p2){
        error.innerHTML = "Passwords must match!";
        return false;
    }
    return true;
}

form.onsubmit = function(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var password2 = document.getElementById("password2").value;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        console.log("State");
        if(xhttp.readyState === 4){
            var resp = JSON.parse(xhttp.responseText);
            if(resp.ErrorStatus === 0){
                document.location.href = "index.html";
            }else{
                if(resp.ErrorStatus === 1){
                    var error = document.getElementById("error");
                    error.innerHTML = "That username is taken, please choose another!" 
                }
            }
        }
    };

    if(checkBlankAndValidate(username, password, password2)){
        xhttp.open("POST", "/auth/register");
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(`username=${username}&password=${password}`);
        return false;
    }else{
        document.getElementById("password").value = "";
        document.getElementById("password2").value = "";
        return false;
    }
};