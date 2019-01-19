const admin = require('firebase-admin');
const { FieldValue } = admin.firestore;


var serviceAccount = require('/Users/geil/.ssh/firebaseKey.json');

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
        password:password
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
async function logout(token){
  var docRef = db.collection("tokens").doc(token);
  docRef.delete().then(function() {
    console.log("Token successfully deleted!");
}).catch(function(error) {
    console.error("Error removing document: ", error);
});
}

async function addTempToken(token, user, exp){
  var docRef = db.collection("tokens").doc(token);
  docRef.set({
    user,
    token,
    expiration: Date.now()+exp
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
    

    return docRef.path;
}
// returns {valid:true, username:username} if token is valid, and 
// {valid:false} otherwise
async function isValidToken(token){
  var docRef = db.collection("tokens").doc(token);
  const doc = await docRef.get();
  if(!doc.exists){
    return {"valid":false};
  }
  const {expiration, user} = doc.data();
  if(expiration < Date.now()){
    return {"valid":false};
  }
  return {"valid":true, "username":user};

}

async function getReview(reviewID){
  //TODO
}

module.exports = {
  addUser,
  validUser,
  logout,
  addTempToken,
  addReviewToDatabase,
  isValidToken
}