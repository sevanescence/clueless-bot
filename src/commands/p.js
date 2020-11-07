const Discord = require('discord.js');
const SongQueue = require('../models/songqueue');
const ytSearch = require('youtube-search');
const ytdl = require('ytdl-core');

const DispatchManager = require('../services/currentdispatch');

module.exports = {
  label: 'p',
  description: 'Play a song in current voice channel.',
  args: 1,
  /**
   * 
   * @param {Array<String>} args 
   * @param {Discord.Message} msg 
   * @param {Discord.Client} client 
   */
  execute(args, msg, client) {
    let botGuildMember = msg.guild.member(client.user.id);
    let botVoiceChannel = botGuildMember.voice.channel;
    let userVoiceChannel = msg.member.voice.channel;

    let argToLink = args[0]; // parse to link if not yt link

    // if (!argToLink.match(/^https:\/\/www\.youtube\.com\/watch\?v=.+?$/g)) {
      
    // }

    const promiseChain = new Promise(res => {
      if (!argToLink.match(/^https:\/\/www\.youtube\.com\/watch\?v=.+?$/g)) {
        ytSearch(argToLink, { maxResults: 1, key: process.env.YT_API_KEY }).then(snapshot => {
          res([(snapshot.results[0]?.link || undefined), (snapshot.results[0]?.title || 'test')]);
        });
      } else {
        let title = '';
        ytdl.getInfo(argToLink).then(info => {
          title = info.videoDetails.title || 'title not found';
          res([argToLink, title]);
        });
      }
    }).then(arr => {

      let queueEmbed = new Discord.MessageEmbed()
      .setTitle('Clueless Bot - Youtube Play')
      .setDescription(`${arr[1]} **added to queue.**`)
      .setColor('#19647d')
      .setFooter('Bot by MakotoMiyamoto#0215');
      
      // handle voice connection
      if (!botVoiceChannel) {
        if (!userVoiceChannel) {
          let embed = new Discord.MessageEmbed()
          .setTitle('Error')
          .setDescription('You need to be in a voice\nchannel to add the bot.')
          .setFooter('Bot by MakotoMiyamoto#0215');
          msg.channel.send(embed);
          return;
        }
        userVoiceChannel.join().then(connection => {
          const guildID = msg.guild.id;
          let songQueue = Object.assign(new SongQueue(), { links: [arr[0]], titles: [arr[1]], currentSong: -1, guildID: guildID });
          songQueue.save().then(() => {

            // meta.connectionManager.addConnection(guildID, connection);
            DispatchManager.initDispatcher(guildID, connection);

            msg.channel.send(queueEmbed.setDescription(`**Now playing** - ${arr[1]}`));

          });
        });
        return;
      }

      SongQueue.getFromCache(msg.guild.id).then(songQueue => {
        if (!songQueue) {
          let newSongQueue = Object.assign(new SongQueue(), { links: [arr[0]], titles: [arr[1]], currentSong: -1, guildID: msg.guild.id });
          newSongQueue.save().then(() => {
            botVoiceChannel.join().then(connection => {

              DispatchManager.initDispatcher(msg.guild.id, connection);

              msg.channel.send(queueEmbed.setDescription(`**Now playing** - ${arr[1]}`));

            });
          });
          return;
        }
        songQueue.links.push(arr[0]);
        songQueue.titles.push(arr[1]);
        songQueue.save().then(() => {
          msg.channel.send(queueEmbed);
          if (process.env.NODE_ENV !== 'production') console.log('added to queue.');
        });
      });

    }); // end of promiseChain
    
  }
}