const admin = require('firebase-admin');
const { FieldValue } = admin.firestore;


var serviceAccount = require('/Users/geil/.ssh/firebaseKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();



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





console.log(
  addReviewToDatabase("Miles", "The Godfather", "\"You'll be sleeping with the fishes!", 2, "example.com"));

