const tmi = require('tmi.js');
require('dotenv').config();

const client = tmi.Client({
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

const twitchbot = (socket) => {
  var lastTime = 0;
  var cooldown = 5000;
  client.on('message', async (channel, tags, message, self) => {
    if (self) return;

    // !list command - creates a pastebin with that user's list of pokemon
    if (message.toLowerCase() === "!list") {
      // TODO
    }
    
    // !pokemon command - throws a pokeball
    if (message.toLowerCase() === "!pokemon" && Date.now() - lastTime > cooldown) {
      client.say(channel, `@${tags.username} throws the Poké Ball!`)
      lastTime = Date.now();
      socket.emit("PokeballReceive", tags.username, (response) => {
        console.log(response.status, "PokeballReceive emit received");
      }) // Problem is here in that it sends duplicate emits, and I don't know why yet; however, client.say isn't duplicated
    } else if (message.toLowerCase() === '!pokemon') {
      client.say(channel, `Cooldown is active. Please wait ${cooldown - (Date.now() - lastTime)} more milliseconds.`);
    }

  })

  client.on('disconnect', () => {
    console.log("Client disconnected");
  })
}


module.exports = twitchbot;