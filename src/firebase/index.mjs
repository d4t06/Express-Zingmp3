import { applicationDefault, initializeApp } from "firebase-admin/app";

// Initialize Firebase
initializeApp({
  credential: applicationDefault(),
  apiKey: process.env.FIREBASE_APIKEY,
  appId: process.env.FIREBASE_APPID,
  projectId: process.env.FIREBASE_PROJECTID,
});
