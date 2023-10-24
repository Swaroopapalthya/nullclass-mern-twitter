import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC39WUSIZRSq-3QVbpGQJm78YMmftUCCZA",
  authDomain: "create-a-page-like-twitter.firebaseapp.com",
  projectId: "create-a-page-like-twitter",
  storageBucket: "create-a-page-like-twitter.appspot.com",
  messagingSenderId: "291699466164",
  appId: "1:291699466164:web:583acbfdde572e195e9ce1",
  measurementId: "G-PWTNQWDRED"
};


const app = initializeApp(firebaseConfig);
const auth= getAuth(app);
export default auth;
