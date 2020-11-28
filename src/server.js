const express = require("express");
const http = require("http");
const socketIo = require('socket.io');
// const discordbot = require('./discordbot');
const twitchbot = require('./twitchbot');


const port = 4001;
const app = express();

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
  
  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  })
})

server.listen(port, () => console.log("Listening on port 4001"));