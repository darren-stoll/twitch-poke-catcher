const tmi = require('tmi.js');
const { ApiClient } = require('twitch');
const { StaticAuthProvider } = require('twitch-auth');
const { PubSubClient } = require('twitch-pubsub-client');
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const accessToken = process.env.ACCESS_TOKEN

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
client.connect();

(async () => {
  try {
    const authProvider = new StaticAuthProvider(clientId, accessToken);
    const apiClient = new ApiClient({ authProvider });
    const pubSubClient = new PubSubClient();
    const userID = await pubSubClient.registerUserListener(apiClient);
    await pubSubClient.onRedemption(userID, async msg => {
      const channel = await apiClient.helix.users.getUserById(msg.channelId);
      client.say(channel.name, `phil just redeemed ${msg.rewardTitle} which cost ${msg.rewardCost}`);
    });
  } catch (err) {
    console.log(err);
  }
  
})();