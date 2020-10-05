const admin = require("firebase-admin");
const firebase = require("firebase");
require("dotenv").config();

const config = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: "ygs-staff-app.firebaseapp.com",
  databaseURL: "https://ygs-staff-app.firebaseio.com",
  projectId: process.env.PROJECT_ID,
  storageBucket: "ygs-staff-app.appspot.com",
  messagingSenderId: "998996396973",
  appId: "1:998996396973:web:7353b2581ccbc0d6f62f24",
  measurementId: "G-0QNBGE3NEE",
};

firebase.initializeApp(config);

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY,
    client_email:
      "firebase-adminsdk-r841b@ygs-staff-app.iam.gserviceaccount.com",
    client_id: process.env.CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-r841b%40ygs-staff-app.iam.gserviceaccount.com",
  }),
  databaseURL: "https://ygs-staff-app.firebaseio.com",
});

const db = admin.firestore();
const auth = firebase.auth();

module.exports = { admin, db, auth };
