// const express = require("express");
// const http = require("http");
// const axios = require('axios');

// const port = 4001;
// const app = express();

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

const twitchbot = async () => {
  try {
    console.log("connecting...");

    client.on('message', async (channel, tags, message, self) => {
      if (self) return;

      const CHANNEL = "#doicm"

      var lastTime = 0;
      var cooldown = 20000;

      if (message.toLowerCase() === "!wsc" && Date.now() - lastTime > cooldown) {
        client.say(CHANNEL, "Weekly Speedrun Challenge (2021) is a self-imposed challenge where I pick a game and category at the beginning of the week and learn to speedrun it by the end of the week. Past challenges listed here: http://bombch.us/DQjF");
        lastTime = Date.now();
      }
    })

    client.on('disconnect', () => {
      console.log("Client disconnected");
    })
  } catch (err) {
    console.log(err);
  }
}

twitchbot();