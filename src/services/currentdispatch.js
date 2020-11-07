const Discord = require('discord.js');
const SongQueue = require('../models/songqueue');
const ytdl = require('ytdl-core');

/**
 * 
 * @param {String} guildID 
 * @param {Discord.VoiceConnection} connection 
 */
function initDispatcher(guildID, connection) {
  SongQueue.getFromCache(guildID).then(songQueue => {
    if (songQueue.currentSong >= songQueue.links.length-1) {
      songQueue.destroy();
      meta.dispatchers.delete(guildID);
      if (process.env.NODE_ENV !== 'production')
        console.log(`Song queue ended in ${guildID}.`);
      return;
    }
    songQueue.currentSong += 1;
    songQueue.save().then(() => {
      const dispatcher = connection.play(ytdl(songQueue.links[songQueue.currentSong]),
      /* options */ {
        volume: 0.25,
        bitrate: 'auto'
      });
      dispatcher.on('finish', () => { initDispatcher(guildID, connection) });
      meta.dispatchers.set(guildID, dispatcher);
    });
  });
}

const meta = {
  /** @type {Map<String, Discord.StreamDispatcher} */
  dispatchers: new Map()
}

module.exports = {
  /** @type {function(string, Discord.VoiceConnection)} */
  initDispatcher,
  meta
}