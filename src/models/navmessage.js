const fs = require('fs');
const path = require('path');

const firebase = require('../services/firebase');
const db = firebase.firestore();
const youtubeCacheDoc = db.collection('youtubeNavigationCache');

class NavigationMessage {
  /** @type {Array<String>} */
  resultLinks;
  messageID;
  authorID;
  currentDisplayedLink = 0;
  /**
   * 
   * @param {Array<String>} resultLinks 
   * @param {String} messageID 
   * @param {String} authorID 
   */
  constructor(resultLinks, messageID, authorID) {
    this.resultLinks = resultLinks;
    this.messageID = messageID;
    this.authorID = authorID;
  }
  buildFromData(data) {

  }
  /** @return {Promise<NavigationMessage>} */
  static getFromCache(messageID) {
    return new Promise(res => {
      youtubeCacheDoc.doc(messageID).get().then(snapshot => {
        if (snapshot.data()) {
          res(Object.assign(new NavigationMessage(), {...snapshot.data()}));
        } else {
          res(undefined);
        }
      });
    });
  }
  save() {
    let json = {
      resultLinks: this.resultLinks,
      messageID: this.messageID,
      authorID: this.authorID,
      currentDisplayedLink: this.currentDisplayedLink
    };
    // fs.writeFileSync(path.join(dir, `${this.messageID}.json`), json);
    return youtubeCacheDoc.doc(this.messageID).set(json);
  }
}

module.exports = NavigationMessage;
