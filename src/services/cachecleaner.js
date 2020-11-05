const admin = require('./firebase');

function clearCache() {
  return new Promise(res => {
    let documentPointers = [];
    admin.firestore().collection('youtubeNavigationCache').get().then(snapshot => {
      for (let doc of snapshot.docs) {
        if (doc.id !== 'placeholder') documentPointers.push(doc.id);
      }
      let col = admin.firestore().collection('youtubeNavigationCache');
      for (let doc of documentPointers) {
        col.doc(doc).delete();
      }
    });
    res(documentPointers.length);
  });
}

module.exports = {
  clearCache
}
