const tmi = require('tmi.js');
const { ApiClient } = require('twitch');
const { StaticAuthProvider } = require('twitch-auth');
const { PubSubClient } = require('twitch-pubsub-client');
const axios = require('axios');

require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const accessToken = process.env.ACCESS_TOKEN;
const broadcasterId = process.env.BROADCASTER_ID;

const greatBallId = process.env.GREAT_BALL;
const ultraBallId = process.env.ULTRA_BALL;
const masterBallId = process.env.MASTER_BALL;

const cooldownHeaders = {
  'client-id': clientId,
  'Authorization': `Bearer ${accessToken}`
}

const cooldownStartRedemptionGBUrl = `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcasterId}&id=${greatBallId}&is_paused=true`;
const cooldownEndRedemptionGBUrl = `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcasterId}&id=${greatBallId}&is_paused=false`;
const configGBCooldownStart = { method: 'patch', url: cooldownStartRedemptionGBUrl, headers: cooldownHeaders }
const configGBCooldownEnd = { method: 'patch', url: cooldownEndRedemptionGBUrl, headers: cooldownHeaders }

const cooldownStartRedemptionUBUrl = `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcasterId}&id=${ultraBallId}&is_paused=true`;
const cooldownEndRedemptionUBUrl = `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcasterId}&id=${ultraBallId}&is_paused=false`;
const configUBCooldownStart = { method: 'patch', url: cooldownStartRedemptionUBUrl, headers: cooldownHeaders }
const configUBCooldownEnd = { method: 'patch', url: cooldownEndRedemptionUBUrl, headers: cooldownHeaders }

const cooldownStartRedemptionMBUrl = `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcasterId}&id=${masterBallId}&is_paused=true`;
const cooldownEndRedemptionMBUrl = `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcasterId}&id=${masterBallId}&is_paused=false`;
const configMBCooldownStart = { method: 'patch', url: cooldownStartRedemptionMBUrl, headers: cooldownHeaders }
const configMBCooldownEnd = { method: 'patch', url: cooldownEndRedemptionMBUrl, headers: cooldownHeaders }

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

const cooldownBalls = () => {
  axios(configGBCooldownStart)
    .then(() => {
      // console.log("cooldown start");
      setTimeout(() => axios(configGBCooldownEnd).then(() => console.log('cooldown end - great')), 20000);
    });
  axios(configUBCooldownStart)
    .then(() => {
      // console.log("cooldown start");
      setTimeout(() => axios(configUBCooldownEnd).then(() => console.log('cooldown end - ultra')), 20000);
    });
  axios(configMBCooldownStart)
    .then(() => {
      // console.log("cooldown start");
      setTimeout(() => axios(configMBCooldownEnd).then(() => console.log('cooldown end - master')), 20000);
    });
}

const twitchbot = async (socket) => {
  try {
    var lastTime = 0;
    var cooldown = 20000;
    var listLastTime = 0;
    var listCooldown = 5000;
    var faqLastTime = 0;
    var faqCooldown = 5000;
    // var twelvehourLastTime = 0;
    // var twelvehourCooldown = 10000;
  
    const CHANNEL = "#doicm"
    const authProvider = new StaticAuthProvider(clientId, accessToken);
    const apiClient = new ApiClient({ authProvider });
    const pubSubClient = new PubSubClient();
    const userID = await pubSubClient.registerUserListener(apiClient);
    
    await pubSubClient.onRedemption(userID, async msg => {

      // console.log(channel);
      // console.log(msg.rewardId);
      // let userSubscriptionStatus = await apiClient.kraken.users.getSubscriptionData(msg.userId, broadcasterId)
      // console.log(msg.userDisplayName, msg.userId, 'is subscribed to', userSubscriptionStatus);
      // console.log(userID);
      if (msg.rewardId === greatBallId) {
        cooldownBalls();
        lastTime = Date.now();
        socket.emit("GreatballReceive", msg.userName, (response) => {
          console.log(response.status, "GreatballReceive emit received");
        }) // Problem is here in that it sends duplicate emits, and I don't know why yet; however, client.say isn't duplicated
      }
      else if (msg.rewardId === ultraBallId) {
        cooldownBalls();
        lastTime = Date.now();
        socket.emit("UltraballReceive", msg.userName, (response) => {
          console.log(response.status, "UltraballReceive emit received");
        }) // Problem is here in that it sends duplicate emits, and I don't know why yet; however, client.say isn't duplicated
      }
      else if (msg.rewardId === masterBallId) {
        cooldownBalls();
        lastTime = Date.now();
        socket.emit("MasterballReceive", msg.userName, (response) => {
          console.log(response.status, "MasterballReceive emit received");
        }) // Problem is here in that it sends duplicate emits, and I don't know why yet; however, client.say isn't duplicated
      }
      // client.say(CHANNEL, `phil just redeemed ${msg.rewardTitle}`);
    });
    
    socket.on('pokemonCaught', data => {
      // console.log("Pokemon has been caught!", data);
      client.say(CHANNEL, `${data.user} caught a ${data.name.toUpperCase()}!`);
    })
    
    client.on('message', async (channel, tags, message, self) => {
      if (self) return;
      // console.log(tags["custom-reward-id"]);
      // if (message.toLowerCase() === "!test") {
      //   console.log(CHANNEL);
      //   client.say(CHANNEL, "Test worked");
      // }
  
      // if (message.toLowerCase() === "!12hr" && Date.now() - twelvehourLastTime > twelvehourCooldown) {
      //   client.say(CHANNEL, "Learning a category to speedrun and then running it in 12 hours. See https://go1den.com/12-hour-challenge/ for more details.");
      //   twelvehourLastTime = Date.now();
      // }
  
      // if (message.toLowerCase() === "!wsc" && Date.now() - twelvehourLastTime > twelvehourCooldown) {
      //   client.say(CHANNEL, "Learning a category to speedrun and then running it in 12 hours. See https://go1den.com/12-hour-challenge/ for more details.");
      //   twelvehourLastTime = Date.now();
      // }
  
      // !faq command for dex
      if (message.toLowerCase() === "!faq" && Date.now() - faqLastTime > faqCooldown) {
        client.say(CHANNEL, "Twitch Pokemon Catcher FAQ here - https://pastebin.com/u36bqFtq");
        faqLastTime = Date.now();
      }

      if (message.toLowerCase() === "!wsc" && Date.now() - lastTime > cooldown) {
        client.say(CHANNEL, "Weekly Speedrun Challenge (2021) is a self-imposed challenge where I pick a game and category at the beginning of the week and learn to speedrun it by the end of the week. Past challenges listed here: http://bombch.us/DQjF");
        lastTime = Date.now();
      }
  
      // !list command - links to that user's list of pokemon
      if (message.toLowerCase() === "!list" && Date.now() - listLastTime > listCooldown) {
        client.say(CHANNEL, `${tags.username}, your list can be found here: https://twitch-doicm-pc.herokuapp.com/trainer/${tags.username}`);
        listLastTime = Date.now();
      }
      
      // !lb command - links to the leaderboards for twitch pokemon catcher
      if (message.toLowerCase() === "!lb" && Date.now() - listLastTime > listCooldown) {
        client.say(CHANNEL, `The leaderboards are hosted here: https://twitch-doicm-leaderboard.herokuapp.com/`);
        listLastTime = Date.now();
      }
      
      // !pokemon command - throws a pokeball
      if (message.toLowerCase() === "!throw" && Date.now() - lastTime > cooldown) {
        // client.say(channel, `@${tags.username} throws the Poké Ball!`)
        // console.log(tags);
        lastTime = Date.now();
        cooldownBalls();
        socket.emit("PokeballReceive", tags.username, (response) => {
          console.log(response.status, "PokeballReceive emit received");
        }) // Problem is here in that it sends duplicate emits, and I don't know why yet; however, client.say isn't duplicated
      } else if (message.toLowerCase() === '!throw') {
        // client.say(channel, `Cooldown is active. Please wait ${cooldown - (Date.now() - lastTime)} more milliseconds.`);
      }
  
    })
  
    client.on('disconnect', () => {
      console.log("Client disconnected");
    })
  } catch (err) {
    console.log(err);
  }
  
}


module.exports = twitchbot;