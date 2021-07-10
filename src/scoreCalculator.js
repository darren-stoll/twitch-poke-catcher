const mongoose = require('mongoose');
const pokeData = require('./pokemon/assets/pokemonData.json');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, 
  {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  })
  
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
  }],
  points: {
    type: Number,
    required: true
  },
  totalScore: Number
})

const Trainer = mongoose.model("Trainer", trainerSchema);

// SCORE
// if >= 225 +1
// elif >= 180 +2
// elif >= 125 +3
// elif >= 75 +5
// elif >= 25 +8
// else +20

Trainer.find().exec(async (err, data) => {
  if (err) throw err;

  console.log("working");
  // console.log(data[0]);
  for (let i = 0; i < data.length; i++) {
  // for (let i = 0; i < 2; i++) {
    let userScore = 0;
    for (let j = 0; j < data[i].pokemon.length; j++) {
      let currPokemon = data[i].pokemon[j];
      let currCatchRate = parseInt(pokeData.pokemon.find(x => x.id === currPokemon.number.toString()).capture_rate);
      if (currCatchRate > 224) userScore += 1;
      else if (currCatchRate > 179) userScore += 2;
      else if (currCatchRate > 124) userScore += 3;
      else if (currCatchRate > 74) userScore += 5;
      else if (currCatchRate > 24) userScore += 8;
      else userScore += 20;
      // console.log(currPokemon.name, currPokemon.number, currCatchRate, userScore);
    }
    console.log(data[i].name, userScore);
    await data[i].updateOne({totalScore: userScore}, err => {
      if (err) throw err;
    });
  }
  mongoose.disconnect();
})
