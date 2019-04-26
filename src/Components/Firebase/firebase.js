import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyDF9F9RrbBPIf08InP93xQ-MJzlH_anHRk',
  authDomain: 'autho-ce94e.firebaseapp.com',
  databaseURL: 'https://autho-ce94e.firebaseio.com',
  projectId: 'autho-ce94e',
  storageBucket: 'autho-ce94e.appspot.com',
  messagingSenderId: '20272200738'
};

class Firebase {
  constructor() {
    firebase.initializeApp(config);
    this.auth = firebase.auth();
    //this.db = firebase.database();
    this.db = firebase.firestore();
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
