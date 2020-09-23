import React, { useEffect, useState } from "react";
import NewGame from "../components/new game/NewGame";
import { useHost, useGameStart, useGameSpyMaster } from "../contexts/GameContext";
import {
  useNewGame,
} from "../contexts/DataContext"; 

import WaitingRoom from "../components/new game/WaitingRoom";
import socket from '../socket';

const GameSetup = (props) => {
  const HostContext = useHost();
  const [isHost, setIsHost] = HostContext;

  const SpyMasterContext = useGameSpyMaster();
  const [isSpyMaster, setIsSpyMaster] = SpyMasterContext;

  const GameStartContext = useGameStart();
  const [gameStart, setGameStart] = GameStartContext;

  const newGameContext = useNewGame();
  const [newGame, setNewGame] = newGameContext;


  const gameJourney = () => {
    if (localStorage.getItem("id") === newGame.hostId) {
      return <NewGame value={props}/>;

    } else {
      return <WaitingRoom />;
    }
  };

  const gameData = localStorage.getItem("newGame");

  useEffect(() => {
    if (gameData) {
      setNewGame(JSON.parse(localStorage.getItem("newGame")));
    }
    //Request isHost and gameStart
    // Updates match state
    socket.on("update-players", (match) => {
      console.log("Updated Players: ", match.players);
    });

     //Shows players now assigned on teams and roles, ALSO - change gameStatus now === "running"
     socket.on("update-roles", (match) => {
      console.log("Updated Roles: ", match);
    });
  }, []);

  // Stores New Game Info to Local Storage
  useEffect(() => {
    localStorage.setItem("newGame", JSON.stringify(newGame));
  }, [newGame]);



  return (
    <div>
      {gameStart === "running" ? <p>Match Component Here</p> : gameJourney()}
      <div>Chat Component Here </div>
    </div>
  );
};

export default GameSetup;