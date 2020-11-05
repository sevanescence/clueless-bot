const admin = require('firebase-admin');

const serviceAccount = require('../../firebase-config.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clueless-bot-35859.firebaseio.com'
});

module.exports = admin;
