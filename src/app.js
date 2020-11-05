const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');

const client = new Discord.Client();
const CommandManager = require('./models/command');

let mode = '';
let commandManager = new CommandManager();

client.once('ready', () => {
  mode = process.env.NODE_ENV || 'development';
  console.log(`Running in ${mode} mode.`);
  // initialize command executor
  commandManager.init(path.join(__dirname, './commands/')).then(() => {
    console.log('Commands initialized.');
  });
});

// command listener
client.on('message', message => {
  if (message.author.bot || !message.content.startsWith(process.env.PREFIX)) {
    return;
  }
  // let tryCommand handle the label in the next upda5te.
  let tempArgs = message.content.split(/\s/);
  let label = tempArgs[1];
  commandManager.tryCommand(label, message, client);
});

client.login(process.env.TOKEN);
