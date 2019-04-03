import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

let config = {
  apiKey: "AIzaSyCK2X4v8vw2QzBGOKY4Pz3gYX2tHNdPhgw",
  authDomain: "authenticate-57354.firebaseapp.com",
  databaseURL: "https://authenticate-57354.firebaseio.com",
  projectId: "authenticate-57354",
  storageBucket: "authenticate-57354.appspot.com",
  messagingSenderId: "454213098463"
};

class Firebase {
  constructor() {
    firebase.initializeApp(config);
    this.auth = firebase.auth();
    //this.db = firebase.database();
    this.db = firebase.firestore();
    console.log(this.db);
  }

  doCreateWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);
}

export default Firebase;
