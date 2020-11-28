
const Discord = require('discord.js');
require('dotenv').config();

const discordbot = socket => {
  const client = new Discord.Client();

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  })

  client.login(process.env.TOKEN)
  client.on('message', async msg => {
    try {
      if (msg.author.bot) return;
      await msg.author.send(`Got your msg: ${msg}`);
      socket.emit("FromAPI", msg.content);
    } catch (err) {
      console.log(err);
    }
  })
}

module.exports = discordbot;