// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import conf from "../../conf/conf.js"
const firebaseConfig = {
  apiKey: conf.firebase.apiKey,
  authDomain: conf.firebase.authDomain,
  projectId: conf.firebase.projectId,
  storageBucket: conf.firebase.storageBucket,
  messagingSenderId: conf.firebase.messagingSenderId,
  appId: conf.firebase.appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export {auth, app as default}