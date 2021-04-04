const express = require("express");
const http = require("http");
const socketIo = require('socket.io');
const twitchbot = require('./twitchbot');
const mongoose = require('mongoose');
const axios = require('axios');

const port = 4001;
const app = express();

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})

var trainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  pokemon: [{
    number: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    datecaught: Date,
    balltype: String
  }]
})

const Trainer = mongoose.model("Trainer", trainerSchema);

const clientId = process.env.CLIENT_ID;
const accessToken = process.env.ACCESS_TOKEN;
const broadcasterId = process.env.BROADCASTER_ID;

const greatBallId = process.env.GREAT_BALL;
const ultraBallId = process.env.ULTRA_BALL;

const cooldownHeaders = {
  'client-id': clientId,
  'Authorization': `Bearer ${accessToken}`
}

const enableRedemptionGBUrl = `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcasterId}&id=${greatBallId}&is_paused=false`;
const disableRedemptionGBUrl = `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcasterId}&id=${greatBallId}&is_paused=true`;
const configGBConnect = { method: 'patch', url: enableRedemptionGBUrl, headers: cooldownHeaders }
const configGBDisconnect = { method: 'patch', url: disableRedemptionGBUrl, headers: cooldownHeaders }

const enableRedemptionUBUrl = `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcasterId}&id=${ultraBallId}&is_paused=false`;
const disableRedemptionUBUrl = `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcasterId}&id=${ultraBallId}&is_paused=true`;
const configUBConnect = { method: 'patch', url: enableRedemptionUBUrl, headers: cooldownHeaders }
const configUBDisconnect = { method: 'patch', url: disableRedemptionUBUrl, headers: cooldownHeaders }

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", socket => {
  console.log("Socket connected");
  axios(configGBConnect)
    .then(function (response) {
      console.log(response.data.data[0].title);
    })
    .catch(function (error) {
      console.log(error);
    });
  axios(configUBConnect)
    .then(function (response) {
      console.log(response.data.data[0].title);
    })
    .catch(function (error) {
      console.log(error);
    });
  socket.removeAllListeners();
  twitchbot(socket);
  // discordbot(socket); // Comment this out if you don't want the discord bot to listen
  socket.on('pokemonCaught', (data) => {
    console.log(data);
    Trainer.findOne({name: data.user}).exec(async (err, userData) => {
      if (err) throw err;
      if (!userData || userData.length === 0) { // If trainer doesn't exist, create new trainer
        var newTrainer = new Trainer({
          name: data.user,
          pokemon: [{
            number: data.id,
            name: data.name,
            datecaught: Date.now(),
            balltype: data.balltype
          }]
        })
        await newTrainer.save();
      } else { // Add a pokemon to an existing trainer
        var newPokemon = {
          number: data.id,
          name: data.name,
          datecaught: Date.now(),
          balltype: data.balltype
        }
        await userData.updateOne({$push: {pokemon: newPokemon}}, {new: true}, err => {
          if (err) throw err;
        })
      }
    })
  })
  
  socket.on("disconnect", () => {
    axios(configGBDisconnect)
      .then(function (response) {
        console.log(response.data.data[0].title);
      })
      .catch(function (error) {
        console.log(error);
      });
    axios(configUBDisconnect)
      .then(function (response) {
        console.log(response.data.data[0].title);
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log("Socket disconnected");
  })
})

server.listen(port, () => console.log("Listening on port 4001"));