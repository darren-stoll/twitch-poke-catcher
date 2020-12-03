const express = require("express");
const http = require("http");
const socketIo = require('socket.io');
const twitchbot = require('./twitchbot');
// const pastebin = require('./pastebin');
const mongoose = require('mongoose');

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
    }
  }]
})

const Trainer = mongoose.model("Trainer", trainerSchema);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", socket => {
  console.log("Socket connected");
  twitchbot(socket);
  // discordbot(socket); // Comment this out if you don't want the discord bot to listen
  socket.on('pokemonCaught', (data) => {
    console.log(data);
    Trainer.findOne({name: data.user}).exec(async (err, userData) => {
      if (err) throw err;
      if (userData.length === 0) { // If trainer doesn't exist, create new trainer
        var newTrainer = new Trainer({
          name: data.user,
          pokemon: [{
            number: data.id,
            name: data.name
          }]
        })
        await newTrainer.save();
      } else { // Add a pokemon to an existing trainer
        var newPokemon = {
          number: data.id,
          name: data.name
        }
        await userData.updateOne({$push: {pokemon: newPokemon}}, {new: true}, err => {
          if (err) throw err;
        })
      }
    })
  })
  
  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  })
})

// pastebin('yo howdy');

server.listen(port, () => console.log("Listening on port 4001"));