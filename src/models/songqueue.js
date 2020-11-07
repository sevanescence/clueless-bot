const Discord = require('discord.js');
const firebase = require('../services/firebase');

const voiceSongQueue = firebase.firestore().collection('voiceSongQueue');

class SongQueue { // change this model lol
  constructor() {
    this.currentSong = -1;
    this.guildID = '0';
    /** @type {Array<String>} */
    this.links = new Array();
    // this is an extremely inefficient method of storing title and link, but i shall change this later. bear with me, okay?
    /** @type {Array<String>} */
    this.titles = new Array();
  }
  /**
   * 
   * @param {String} guildID 
   * @return {Promise<SongQueue>}
   */
  static getFromCache(guildID) {
    return new Promise(res => {
      voiceSongQueue.doc(guildID).get().then(snapshot => {
        if (snapshot.exists) {
          res(Object.assign(new SongQueue(), {...snapshot.data()}));
        } else {
          res(undefined);
        }
      });
    });
  }
  save() {
    return voiceSongQueue.doc(this.guildID).set(Object.assign({}, this));
  }
  destroy() {
    return voiceSongQueue.doc(this.guildID).delete();
  }
}

module.exports = SongQueue;
