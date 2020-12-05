import React from 'react';
import './Pokemon.scss';
import pokeData from './assets/pokemonData.json';
import Pokeball from './assets/Pokeball.png';
import PokeOneShake from './assets/PokeOneShake.gif';
import PokeTwoShakes from './assets/PokeTwoShakes.gif';
import PokeThreeShakes from './assets/PokeThreeShakes.gif';
import PokeCaught from './assets/PokeCaught.png';
import PokeSmoke from './assets/PokeSmoke.gif';

import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";

const socket = socketIOClient(ENDPOINT);


// Keep a list of pokemon a user has caught

const Pokemon = ({imgIncrement, setImgIncrement, pokemon, setPokemon, catchAttempt, setCatchAttempt, animationTrigger, setAnimationTrigger, currUser, setCurrUser}) => {
  const [currImg, setCurrImg] = React.useState('')
  const [wrapperClass, setWrapperClass] = React.useState('');
  const [pokemonClass, setPokemonClass] = React.useState('pokemon');
  const [pokemonVis, setPokemonVis] = React.useState(false);
  const [pokemonText, setPokemonText] = React.useState('');

  const freePokemon = () => {
    if (catchAttempt === 5) setImgIncrement(51);
  }

  React.useEffect(() => {
    const receiveBall = (data, callback) => {
      setCurrUser(data);
      setAnimationTrigger(1);
      callback({
        status: 'ok'
      })
    }
    socket.on("PokeballReceive", (data, callback) => receiveBall(data, callback));
  // eslint-disable-next-line
  }, [socket]);

  React.useEffect(() => { 
    
    switch (imgIncrement) {
      // Thrown pokeball animation
      case 0:
        setCurrImg('');
        setWrapperClass("innerBase");
        setPokemonVis(true);
        setPokemonText('');
        break;
      case 1:
      case 11:
      case 21:
      case 31:
      case 41:
        setCurrImg('');
        setPokemonVis(true);
        if (catchAttempt === 1) {
          setPokemonText(`A wild ${pokemon.name.toUpperCase().replace(/-/gi, " ")} appears`);
          setPokemonClass("pokeFadeIn");
        }
        else {
          setPokemonText(`${pokemon.name.toUpperCase().replace(/-/gi, " ")} is watching closely...`);
          setWrapperClass("emptyTime");
        }
        break;
      case 2:
      case 12:
      case 22:
      case 32:
      case 42:
        setCurrImg(Pokeball);
        setWrapperClass("throw");
        setPokemonVis(true);
        setPokemonText(`${currUser.toUpperCase().substring(0, 16)} threw a POKé BALL`);
        break;
      case 3:
      case 13:
      case 23:
      case 33:
      case 43:
        setCurrImg(PokeSmoke);
        setWrapperClass("PokeSmoke");
        break;
      case 4:
      case 14:
      case 24:
      case 34:
      case 44:
        setCurrImg('');
        setWrapperClass("postSmoke");
        setPokemonVis(false);
        break;
      // Thrown pokeball, successful catch
      case 5:
        setCurrImg(PokeThreeShakes);
        setWrapperClass("PokeThreeShakes");
        setPokemonText("...");
        break;
      case 6:
        setCurrImg(PokeCaught);
        setWrapperClass("PokeCaught");
        setPokemonText(`Gotcha! ${currUser.toUpperCase().substring(0, 16)} caught ${pokemon.name.toUpperCase().replace(/-/gi, " ")}!`);
        setPokemonClass('');
        var emitObject = {...pokemon, user: currUser}
        socket.emit('pokemonCaught', emitObject);
        break;
      case 7:
        setCurrImg('');
        setPokemon('');
        setWrapperClass("innerBase");
        setImgIncrement(0);
        setCatchAttempt(0);
        break;

      // Thrown pokeball, fails after 3 wobbles
      case 15:
        setCurrImg(PokeThreeShakes);
        setWrapperClass("PokeThreeShakes")
        setPokemonText("...");
        break;
      case 16:
        setCurrImg(PokeSmoke);
        setWrapperClass("PokeSmokeOut");
        break;
      case 17:
        setCurrImg('');
        setWrapperClass("failedCatch");
        setPokemonVis(true);
        setPokemonText(`Gah! It was so close, too!`);
        freePokemon();
        break;
      case 18:
        setWrapperClass("innerBase");
        setImgIncrement(0);
        break;
      // Thrown pokeball, fails after 2 wobbles
      case 25:
        setCurrImg(PokeTwoShakes);
        setWrapperClass("PokeTwoShakes")
        setPokemonText("...");
        break;
      case 26:
        setCurrImg(PokeSmoke);
        setWrapperClass("PokeSmokeOut");
        break;
      case 27:
        setCurrImg('');
        setWrapperClass("failedCatch");
        setPokemonVis(true);
        setPokemonText(`Aargh! Almost had it!`);
        freePokemon();
        break;
      case 28:
        setWrapperClass("innerBase");
        setImgIncrement(0);
        break;
      // Thrown pokeball, fails after 1 wobble
      case 35:
        setCurrImg(PokeOneShake);
        setWrapperClass("PokeOneShake")
        setPokemonText("...");
        break;
      case 36:
        setCurrImg(PokeSmoke);
        setWrapperClass("PokeSmokeOut");
        break;
      case 37:
        setCurrImg('');
        setWrapperClass("failedCatch");
        setPokemonVis(true);
        setPokemonText(`Aww! It appeared to be caught!`);
        freePokemon();
        break;
      case 38:
        setWrapperClass("innerBase");
        setImgIncrement(0);
        break;
      // Thrown pokeball, no wobbles
      case 45:
        setCurrImg(Pokeball);
        setWrapperClass("PokeNoShake")
        setPokemonText("...");
        break;
      case 46:
        setCurrImg(PokeSmoke);
        setWrapperClass("PokeSmokeOut");
        break;
      case 47:
        setCurrImg('');
        setWrapperClass("emptyTime");
        setPokemonVis(true);
        setPokemonText(`Oh no! The Pokémon broke free!`);
        freePokemon();
        break;
      case 48:
        setWrapperClass("innerBase");
        setImgIncrement(0);
        break;
      // Pokemon runs away
      case 51:
        setCurrImg('');
        setWrapperClass("emptyTime");
        setPokemonVis(true);
        break;
      case 52:
        setPokemonClass('pokeFadeOut');
        setPokemonText(`Wild ${pokemon.name.toUpperCase().replace(/-/gi, " ")} ran away!`);
        break;
      case 53:
        setPokemon('');
        setPokemonVis(false);
        setPokemonClass('pokemon');
        setPokemonText('');
        setImgIncrement(0);
        setCatchAttempt(0);
        break;
      // Default
      default:
        break;
    }
  // eslint-disable-next-line
  }, [imgIncrement, catchAttempt, pokemon])

  const animationSequence = () => {
    if (imgIncrement === 0) {
      var currPokemon;
      if (catchAttempt === 0) {
        var randomPokemonID = Math.floor(Math.random() * (899 - 1) + 1);
        setPokemon(pokeData.pokemon[randomPokemonID - 1]);
        currPokemon = pokeData.pokemon[randomPokemonID - 1]; // Setting another variable to account for setPokemon going async
        // setPokemon(pokeData.pokemon[9]); // Use this for debugging, since Caterpie is nice and easy to catch relatively
        // currPokemon = pokeData.pokemon[9];
        setCatchAttempt(1);
      }
      else {
        setCatchAttempt(catchAttempt + 1);
        currPokemon = pokemon;
      }
      let capture; 
      let currentThrowOdds = (Math.random() * 256) + 0.000000001;

      if (pokemon !== '') {
        capture = parseInt(pokemon.capture_rate) / currentThrowOdds;
        console.log(capture, pokemon.capture_rate);
      } else {
        capture = parseInt(currPokemon.capture_rate) / currentThrowOdds;
        console.log(capture, currPokemon.capture_rate);
      }
      
      if (capture >= 1) {
        setImgIncrement(1);
      } else if (capture >= 0.75) {
        setImgIncrement(11);
      } else if (capture >= 0.5) {
        setImgIncrement(21);
      } else if (capture >= 0.25) {
        setImgIncrement(31);
      } else {
        setImgIncrement(41);
      }
    }
  }

  React.useEffect(() => {
    if (animationTrigger === 1) {
      animationSequence();
      setAnimationTrigger(0);
    }

  })

  return (
    <div className="container">
      <div className="canvas">
        <div className={wrapperClass} onAnimationEnd={() => {
          console.log(imgIncrement);
          setImgIncrement(imgIncrement + 1)
        }}>
          <img src={currImg} alt={currImg} />
        </div>
        <div className="pokemonWrapper">
          <img 
            className={pokemonClass} 
            src={pokemonVis && pokemon !== '' ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png` : ''} 
            alt={pokemonVis && pokemon !== '' ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png` : ''} 
            onAnimationEnd={() => setImgIncrement(imgIncrement + 1)}
            />
        </div>
      </div>
      {pokemonText !== '' ? <div className="pokemonText">
        {pokemonText}
      </div> : <div style={{height: "46.4px"}}></div>}
      
    </div>
  );
}

export default Pokemon;
