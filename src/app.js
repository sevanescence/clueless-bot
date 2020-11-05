const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');

const client = new Discord.Client();
const CommandManager = require('./models/command');
const ReactionListener = require('./events/reactionlistener');
const CacheCleaner = require('./services/cachecleaner');

// TODO: change cache to network reaction thing

let mode = '';
let commandManager = new CommandManager();

client.once('ready', () => {
  mode = process.env.NODE_ENV || 'development';
  console.log(`Running in ${mode} mode.`);
  // initialize command executor
  commandManager.init(path.join(__dirname, './commands/')).then(() => {
    console.log('Commands initialized.');
  });
  // note that messages sent before current bot instance will not fire react events.
  ReactionListener.init(client).then(() => {
    console.log('Event listeners initialized.');
  });
  CacheCleaner.clearCache().then(deletedEntires => {
    console.log(`Deleted ${deletedEntires} entires from cache.`);
  });
});

const cmdPrefix = process.env.PREFIX || '.c';

// command listener
client.on('message', message => {
  if (message.author.bot || !message.content.startsWith(cmdPrefix)) {
    return;
  }
  // let tryCommand handle the label in the next upda5te.
  let tempArgs = message.content.split(/\s/);
  let label = tempArgs[1];
  commandManager.tryCommand(label, message, client);
});

client.login(process.env.TOKEN);
