// Native builds get the config from google-services.json GoogleService-Info.plist
import firebase from 'firebase/compat/app';

const firebaseConfig = {
  apiKey: "AIzaSyDSgSL8xfnnqgMRVJ0MZuNuF5ZCtbHHyjQ",
  authDomain: "aireciperrecommender.firebaseapp.com",
  projectId: "aireciperrecommender",
  storageBucket: "aireciperrecommender.appspot.com",
  messagingSenderId: "865020791077",
  appId: "1:865020791077:web:d8c3bfa0a7ae5cc516b2cc",
  measurementId: "G-2XJ9HTSWFK"
};

const initializeApp = (): void => {
  firebase.initializeApp(firebaseConfig);
};

export default initializeApp;
