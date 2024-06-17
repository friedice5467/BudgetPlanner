// Native builds get the config from google-services.json GoogleService-Info.plist
import firebase from 'firebase/compat/app';

const firebaseConfig = {
  apiKey: "AIzaSyDggVXgkiX9winfn3JwLMUyd2qGVXPy8n0",
  authDomain: "budgetplanner-9f6f2.firebaseapp.com",
  projectId: "budgetplanner-9f6f2",
  storageBucket: "budgetplanner-9f6f2.appspot.com",
  messagingSenderId: "699938425719",
  appId: "1:699938425719:web:68236dfed6459927536f72",
  measurementId: "G-0RCBCVH6D2"
};

const initializeApp = (): void => {
  firebase.initializeApp(firebaseConfig);
};

export default initializeApp;
