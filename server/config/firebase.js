// var firebase = require('firebase')
const admin = require('firebase-admin');

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDK_AuBmTy9of13z0aYrexAlUSPntRZIJg",
//   authDomain: "savannah-f0b6e.firebaseapp.com",
//   projectId: "savannah-f0b6e",
//   storageBucket: "savannah-f0b6e.appspot.com",
//   messagingSenderId: "421859137422",
//   appId: "1:421859137422:web:fd0853bcc4e6c11da9f6df",
//   measurementId: "G-8D40SY0FBJ"
// };

// Initialize Firebase
// const app = firebase.initializeApp(firebaseConfig);
// let database = firebase.database()
// const analytics = firebase.getAnalytics(app);

var serviceAccount = require("./savannah-f0b6e-firebase-adminsdk-o7xgp-f39dfc6ee4.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://savannah-f0b6e-default-rtdb.firebaseio.com`
});
// const database = admin.firestore(); 
let database = admin.firestore()

// const usersDb = database.collection('tests'); 
// const liam = usersDb.doc('lragozzine'); 
// liam.set({
//     first: 'Liam',
//     last: 'Ragozzine',
//     address: '133 5th St., San Francisco, CA',
//     birthday: '05/13/1990',
//     age: '30'
//    });

// var ref = database.ref("restricted_access/secret_document");
// ref.once("value", function(snapshot) {
// console.log(snapshot.val());
// });
// let database = admin.database()

module.exports =  database 