const admin = require('firebase-admin');
const { FieldValue } = admin.firestore;

// use command export NODE_PATH=$NODE_PATH:/Path/to/.ssh folder
var serviceAccount = require('firebaseKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

async function addUser(username, password){
  var docRef = db.collection("users").doc(username);
  const doc = await docRef.get();
  if (doc.exists) {
        return 1;
    } else {
      docRef.set({
        username: username,
        password:password,
        count:0
      });
      return 0;
    }
  }
async function validUser(u, p){
  var docRef = db.collection("users").doc(u);
  const doc = await docRef.get();
  if(!doc.exists){
    return 1;
  }else{
    const { username, password } = doc.data();
    if(username === u && password === p){
      return 0;
    }else{
      //Invalid password!
      return 2;
    }
  }
}

async function isLoggedIn(username){
  var docRef = db.collection("logged_users").doc(username);
  const doc = await docRef.get();
  if(!doc.exists){
    return false;
  }else{
    const {expiration, token, user} = doc.data();
    if(expiration < Date.now()){
      return false;
    }else{
      return true;
    }
  }
}

async function logout(token){
  var docRef = db.collection("tokens").doc(token);
  docRef.delete().then(function() {
    console.log("Token successfully deleted!");
}).catch(function(error) {
    console.error("Error removing document: ", error);
});
}

async function addTempToken(tok, user, exp){
  var expiration = Date.now()+exp;
  var loggedin = db.collection("logged_users").doc(user);
  const doc = await loggedin.get();
  // attempts to delete the document of an old token
  if(doc.exists){
    const {token} = doc.data();
    db.collection("tokens").doc(token).delete().then(function () {
      console.log("Deleted an old token");
    }).catch(function (error){ console.error("Error deleting token: ", error);});
  }
  loggedin.set({
    user,
    token:tok,
    expiration
  })
  // create token stored value
  var docRef = db.collection("tokens").doc(tok);
  docRef.set({
    user,
    token:tok,
    expiration: expiration
  })
}

async function addReviewToDatabase(user, title, review, rating) {
    var docRef = db.collection('reviews').doc();
    var setReturn = docRef.set({
      title: title,
      review: review,
      rating: rating,
      creationTime: FieldValue.serverTimestamp()
    });
    var userdocRef = db.collection("users").doc(user);
    const v = await userdocRef.get();
    //TODO: check here
    const {count} = v.data();
    userdocRef.update({
      reviews:FieldValue.arrayUnion(docRef.path),
      count:count+1
    })

    return {"ok":true, "id":docRef.path};
}
// returns {valid:true, username:username} if token is valid, and 
// {valid:false} otherwise
async function isValidToken(token){
  var docRef = db.collection("tokens").doc(token);
  const doc = await docRef.get();
  if(!doc.exists){
    console.log("Attempting to log in with invalid token");
    return {"valid":false, "ErrorMessage":"Token not found in database"};
  }
  const {expiration, user} = doc.data();
  if(expiration < Date.now()){
    console.log("Attempting to log in with expired token");
    console.log("Token expired at "+expiration+" and it is now "+Date.now());
    return {"valid":false, "ErrorMessage":"Token is expired"};
  }
  return {"valid":true, "username":user};

}

async function getPosts(user, cursor){
  var docRef = db.collection("users").doc(user);
  const doc = await docRef.get();
  if(doc.exists){
    var r = doc.get("reviews");
    var count = doc.get("count");
    if(cursor >= count){
      return {"ok":true, "cursor":-1};
    }
    var movies = [];
    var i = cursor;
    for(; i<cursor+5; i++){
      if(i == count){
        return {"ok":true, "cursor":-1, "posts":movies};
      }
      var mreviewRef = db.doc(r[i]);
      var temp = await mreviewRef.get();
      const {rating, review, title} = temp.data();
      movies.push({rating, review, title, "post_id":r[i]});
    }
    return {"ok":true, "cursor":i, "posts":movies};

  }else{
    console.log(`Unable to access information for user ${user}`);
    return {"ok":false, "cursor":cursor, "Error":"Unknown error occurred"};
  }
}

module.exports = {
  addUser,
  validUser,
  isLoggedIn,
  logout,
  addTempToken,
  addReviewToDatabase,
  isValidToken,
  getPosts
}
