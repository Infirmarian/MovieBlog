//index.js
function renderData(){
    if(getCookie("username") !== null){
        document.getElementById("user").innerHTML = getCookie("username");
        document.getElementById("logout").style.visibility = "visible";
    }else{
        document.getElementById("user").innerHTML = "No user logged in";
        document.getElementById("log").innerHTML = "Login";
        document.getElementById("logout").style.visibility = "hidden";
    }
}
function logout(){
    if(getCookie("username") !== null){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () =>{
            if(xhttp.readyState == 4){
                // remove cookies
                document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                renderData();
            }
        }
        xhttp.open("POST", "/auth/logout", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(`username=${getCookie("username")}`);
    }
}



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

renderData();