import './App.css';
import React from 'react'
import Pokemon from './pokemon/Pokemon';
// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://127.0.0.1:4001";

// const socket = socketIOClient(ENDPOINT);

function App() {
  const [imgIncrement, setImgIncrement] = React.useState(0);
  const [pokemon, setPokemon] = React.useState('');
  const [catchAttempt, setCatchAttempt] = React.useState(0);
  const [animationTrigger, setAnimationTrigger] = React.useState(0);
  const [currUser, setCurrUser] = React.useState('');
  
  return (
    <div>
      <Pokemon 
        imgIncrement = {imgIncrement}
        setImgIncrement = {setImgIncrement}
        pokemon = {pokemon}
        setPokemon = {setPokemon}
        catchAttempt = {catchAttempt}
        setCatchAttempt = {setCatchAttempt}
        animationTrigger = {animationTrigger}
        setAnimationTrigger = {setAnimationTrigger}
        currUser = {currUser}
        setCurrUser = {setCurrUser}
        />
      {/* <input type="button" value="Button" onClick={() => {
        setAnimationTrigger(1)}
      } /> */}
    </div>
  );
}

export default App;
