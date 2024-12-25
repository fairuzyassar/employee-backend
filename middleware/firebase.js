const admin = require('firebase-admin');
const serviceAccount = require("../serviceKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.BUCKET_URL
  });

module.exports = admin;