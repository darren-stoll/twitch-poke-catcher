const tmi = require('tmi.js');
require('dotenv').config();

const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true
  },
  identity: {
    username: 'doicmbotBeepBoop',
    password: process.env.TWITCH_TOKEN
  },
  channels: ['doicm']
});
client.connect()
  .then(() => {
    console.log("Client connected")
  })
  .catch(err => {
    console.log("Error: ", err);
  });

const twitchbot = socket => {
  var lastTime = 0;
  var cooldown = 20000;
  client.on('message', (channel, tags, message, self) => {
    if (self) return;
    
    if (message.toLowerCase() === "!pokemon" && Date.now() - lastTime > cooldown) {
      client.say(channel, `@${tags.username} throws the Poké Ball!`)
      lastTime = Date.now();
      socket.emit("PokeballReceive", tags.username)
    } else if (message.toLowerCase() === '!pokemon') {
      client.say(channel, `Cooldown is active. Please wait ${cooldown - (Date.now() - lastTime)} more milliseconds.`);
    }

  })

  client.on('disconnect', () => {
    console.log("Client disconnected");
  })
}


module.exports = twitchbot;