// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
import {getDatabase} from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAggP90bV1gTJN9SlAzjjjaJ2F-ocGi3pY',
  authDomain: 'interviewapp-39136.firebaseapp.com',
  databaseURL: 'https://interviewapp-39136-default-rtdb.firebaseio.com',
  projectId: 'interviewapp-39136',
  storageBucket: 'interviewapp-39136.appspot.com',
  messagingSenderId: '170601039991',
  appId: '1:170601039991:web:b0cc6a5e168c3f96c39e72',
  measurementId: 'G-VTC9B0T5W7',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// initialize the database
const db = getDatabase(app);

export {db};
