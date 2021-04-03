import React from 'react';
import './Pokemon.scss';
import pokeData from './assets/pokemonData.json';
import Pokeball from './assets/Pokeball/Pokeball.png';
import PokeOneShake from './assets/Pokeball/PokeOneShake.gif';
import PokeTwoShakes from './assets/Pokeball/PokeTwoShakes.gif';
import PokeThreeShakes from './assets/Pokeball/PokeThreeShakes.gif';
import PokeCaught from './assets/Pokeball/PokeCaught.png';
import PokeSmoke from './assets/PokeSmoke.gif';

import Greatball from './assets/Greatball/Greatball.png';
import GreatOneShake from './assets/Greatball/GreatOneShake.gif';
import GreatTwoShakes from './assets/Greatball/GreatTwoShakes.gif';
import GreatThreeShakes from './assets/Greatball/GreatThreeShakes.gif';
import GreatCaught from './assets/Greatball/GreatCaught.png';

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
  const [timer, setTimer] = React.useState(4);

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

    const receiveGreatBall = (data, callback) => {
      setCurrUser(data);
      setAnimationTrigger(2);
      callback({
        status: 'ok'
      })
    }
    socket.on("GreatballReceive", (data, callback) => receiveGreatBall(data, callback));
  // eslint-disable-next-line
  }, [socket]);

  React.useEffect(() => { 
    var emitObject;
    
    switch (imgIncrement) {
      /* POKEBALL */

      // Thrown Pokeball animation
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
        setPokemonClass('pokemon');
        setPokemonText(`${pokemon.name.toUpperCase().replace(/-/gi, " ")} is watching closely...`);
        setWrapperClass("emptyTime");
        setTimer(20);
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
        emitObject = {...pokemon, user: currUser}
        socket.emit('pokemonCaught', emitObject);
        break;
      case 7:
        setCurrImg('');
        setPokemon('');
        setWrapperClass("innerBase");
        setImgIncrement(0);
        setCatchAttempt(0);
        loadNewPokemon();
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
        loadNewPokemon();
        break;

      /* GREAT BALL, 10 */

      case 101:
      case 1011:
      case 1021:
      case 1031:
      case 1041:
        setCurrImg('');
        setPokemonVis(true);
        setPokemonClass('pokemon');
        setPokemonText(`${pokemon.name.toUpperCase().replace(/-/gi, " ")} is watching closely...`);
        setWrapperClass("emptyTime");
        setTimer(20);
        break;
      case 102:
      case 1012:
      case 1022:
      case 1032:
      case 1042:
        setCurrImg(Greatball);
        setWrapperClass("throw");
        setPokemonVis(true);
        setPokemonText(`${currUser.toUpperCase().substring(0, 16)} threw a GREAT BALL`);
        break;
      case 103:
      case 1013:
      case 1023:
      case 1033:
      case 1043:
        setCurrImg(PokeSmoke);
        setWrapperClass("PokeSmoke");
        break;
      case 104:
      case 1014:
      case 1024:
      case 1034:
      case 1044:
        setCurrImg('');
        setWrapperClass("postSmoke");
        setPokemonVis(false);
        break;
      // Thrown pokeball, successful catch
      case 105:
        setCurrImg(GreatThreeShakes);
        setWrapperClass("PokeThreeShakes");
        setPokemonText("...");
        break;
      case 106:
        setCurrImg(GreatCaught);
        setWrapperClass("PokeCaught");
        setPokemonText(`Gotcha! ${currUser.toUpperCase().substring(0, 16)} caught ${pokemon.name.toUpperCase().replace(/-/gi, " ")}!`);
        setPokemonClass('');
        emitObject = {...pokemon, user: currUser}
        socket.emit('pokemonCaught', emitObject);
        break;
      case 107:
        setCurrImg('');
        setPokemon('');
        setWrapperClass("innerBase");
        setImgIncrement(0);
        setCatchAttempt(0);
        loadNewPokemon();
        break;

      // Thrown pokeball, fails after 3 wobbles
      case 1015:
        setCurrImg(GreatThreeShakes);
        setWrapperClass("PokeThreeShakes")
        setPokemonText("...");
        break;
      case 1016:
        setCurrImg(PokeSmoke);
        setWrapperClass("PokeSmokeOut");
        break;
      case 1017:
        setCurrImg('');
        setWrapperClass("failedCatch");
        setPokemonVis(true);
        setPokemonText(`Gah! It was so close, too!`);
        freePokemon();
        break;
      case 1018:
        setWrapperClass("innerBase");
        setImgIncrement(0);
        break;
      // Thrown pokeball, fails after 2 wobbles
      case 1025:
        setCurrImg(GreatTwoShakes);
        setWrapperClass("PokeTwoShakes")
        setPokemonText("...");
        break;
      case 1026:
        setCurrImg(PokeSmoke);
        setWrapperClass("PokeSmokeOut");
        break;
      case 1027:
        setCurrImg('');
        setWrapperClass("failedCatch");
        setPokemonVis(true);
        setPokemonText(`Aargh! Almost had it!`);
        freePokemon();
        break;
      case 1028:
        setWrapperClass("innerBase");
        setImgIncrement(0);
        break;
      // Thrown pokeball, fails after 1 wobble
      case 1035:
        setCurrImg(GreatOneShake);
        setWrapperClass("PokeOneShake")
        setPokemonText("...");
        break;
      case 1036:
        setCurrImg(PokeSmoke);
        setWrapperClass("PokeSmokeOut");
        break;
      case 1037:
        setCurrImg('');
        setWrapperClass("failedCatch");
        setPokemonVis(true);
        setPokemonText(`Aww! It appeared to be caught!`);
        freePokemon();
        break;
      case 1038:
        setWrapperClass("innerBase");
        setImgIncrement(0);
        break;
      // Thrown pokeball, no wobbles
      case 1045:
        setCurrImg(Greatball);
        setWrapperClass("PokeNoShake")
        setPokemonText("...");
        break;
      case 1046:
        setCurrImg(PokeSmoke);
        setWrapperClass("PokeSmokeOut");
        break;
      case 1047:
        setCurrImg('');
        setWrapperClass("emptyTime");
        setPokemonVis(true);
        setPokemonText(`Oh no! The Pokémon broke free!`);
        freePokemon();
        break;
      case 1048:
        setWrapperClass("innerBase");
        setImgIncrement(0);
        break;
      // Pokemon runs away
      case 1051:
        setCurrImg('');
        setWrapperClass("emptyTime");
        setPokemonVis(true);
        break;
      case 1052:
        setPokemonClass('pokeFadeOut');
        setPokemonText(`Wild ${pokemon.name.toUpperCase().replace(/-/gi, " ")} ran away!`);
        break;
      case 1053:
        setPokemon('');
        setPokemonVis(false);
        setPokemonClass('pokemon');
        setPokemonText('');
        setImgIncrement(0);
        setCatchAttempt(0);
        loadNewPokemon();
        break;

      // Default
      default:
        break;
    }
  // eslint-disable-next-line
  }, [imgIncrement, catchAttempt, pokemon])

  React.useEffect(() => {
    if (timer > 0) {
      // console.log('timer is', timer);
      setTimeout(() => {
        setTimer(t => t - 1);
      }, 1000);
    }
  }, [timer])

  const loadNewPokemon = async () => {
    setTimeout(() => {
      var randomPokemonID = Math.floor(Math.random() * (899 - 1) + 1);
      setPokemon(pokeData.pokemon[randomPokemonID - 1])
    }, 2000);
  }

  React.useEffect(() => {
    if (pokemon !== '') {
      setWrapperClass("innerBase");
      setPokemonVis(true);
      console.log('pokemon', pokemon);
      setPokemonText(`A wild ${pokemon.name.toUpperCase().replace(/-/gi, " ")} appears`);
      setTimeout(() => {
        setPokemonText('')
      }, 2000);
      setPokemonClass('pokeFadeIn');
    }
  }, [pokemon])

  const animationSequence = async (balltype) => {
    if (imgIncrement === 0) {
      var currPokemon;
      setCatchAttempt(catchAttempt + 1);
      currPokemon = pokemon;

      let capture; 
      
      if (balltype === "poke") {
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
      else if (balltype === "great") {
        let currentThrowOdds = (Math.random() * 256) + 0.000000001;
        if (pokemon !== '') {
          capture = parseInt(pokemon.capture_rate)*1.5 / currentThrowOdds;
          console.log(capture, pokemon.capture_rate);
        } else {
          capture = parseInt(currPokemon.capture_rate)*1.5 / currentThrowOdds;
          console.log(capture, currPokemon.capture_rate);
        }
        
        if (capture >= 1) {
          setImgIncrement(101);
        } else if (capture >= 0.75) {
          setImgIncrement(1011);
        } else if (capture >= 0.5) {
          setImgIncrement(1021);
        } else if (capture >= 0.25) {
          setImgIncrement(1031);
        } else {
          setImgIncrement(1041);
        }
      }
    }
  }

  React.useEffect(() => {
    if (animationTrigger === 1) {
      animationSequence("poke");
      setAnimationTrigger(0);
    } else if (animationTrigger === 2) {
      animationSequence("great");
      setAnimationTrigger(0);
    }

  })

  React.useEffect(() => {
    loadNewPokemon();
  // eslint-disable-next-line
  }, [])

  return (
    <div className="container">
      <div className="canvas">
        <div className={wrapperClass} onAnimationEnd={() => {
          console.log(imgIncrement);
          if (pokemonClass !== 'pokeFadeIn') setImgIncrement(imgIncrement + 1)
        }}>
          <img src={currImg} alt={currImg} />
        </div>
        <div className="pokemonWrapper">
          <img 
            className={pokemonClass} 
            src={pokemonVis && pokemon !== '' ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png` : ''} 
            alt={pokemonVis && pokemon !== '' ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png` : ''} 
            onAnimationEnd={() => {
              if (pokemonClass !== 'pokeFadeIn') setImgIncrement(imgIncrement + 1)
            }}
            />
        </div>
      </div>
      {pokemonText !== '' ? <div className="pokemonText">
        {pokemonText}
      </div> : <div style={{height: "46.4px"}}></div>}
      {timer > 0 ? <div className="timer">Cooldown timer: {timer}</div>
       : <div className="timer">Ready to !throw</div>}
    </div>
  );
}

export default Pokemon;
