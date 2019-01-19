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
//TODO:
async function logout(u){
  var docRef = db.collection("tokens").doc(u);
  docRef.delete().then(function() {
    console.log("Document successfully deleted!");
}).catch(function(error) {
    console.error("Error removing document: ", error);
});
}

async function addTempToken(token, user, exp){
  var docRef = db.collection("tokens").doc(user);
  docRef.set({
    user,
    token,
    expiration: Date.now()+exp
  })
}

async function addReviewToDatabase(user, title, review, rating, img_url) {
    var docRef = db.collection('reviews').doc();
    var setReturn = docRef.set({
      title: title,
      review: review,
      rating: rating,
      img_url:img_url,
      creationTime: FieldValue.serverTimestamp()
    });
    return docRef.path;
}


async function getReview(reviewID){
  //TODO
}

module.exports = {
  addUser,
  validUser,
  logout,
  addTempToken,
  addReviewToDatabase
}