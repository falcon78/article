import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import config from './credentials';

class Firebase {
  constructor() {
    firebase.initializeApp(config);
    this.auth = firebase.auth();
    // this.db = firebase.database();
    this.db = firebase.firestore();
    this.storage = firebase.storage;
    this.firebase = firebase;
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
