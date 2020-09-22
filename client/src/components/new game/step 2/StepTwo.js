import React, { useEffect, useState } from "react";
import { useNewGame, usePlayers } from "../../../contexts/DataContext";

import axios from "axios";
import socket from "../../../socket";

const StepTwo = () => {
  const newGameContext = useNewGame();
  const [newGame, setNewGame] = newGameContext;
  const [message, setMessage] = useState("");

  const usePlayersContext = usePlayers();
  const [players, setPlayers] = usePlayersContext;

  useEffect(() => {
    // User joins the match

    //Sent Loggedin user (send email)

    if (newGame.matchId) {
      let room = "match-" + newGame.matchId;
      let matchId = newGame.matchId;
      let email = localStorage.getItem("email");
      let data = {
        room: room,
        matchId: matchId,
        email: email,
      };

      // User joins the room
      socket.emit("joinmatch", data);
      console.log('karldata', data)
      // New user joining notification
      socket.on("joined-match", (data) => {
        alert(data);
        console.log("Current Room: ", room);
      });

      // Updated players array (Data lagging one step behind and needs to be fixed)
      socket.on("update-players", (players) => {
        setPlayers(players);
        console.log("Updated Players: ", players);
      });
    }

    // // close the socket when page is left
    // return () => socket.disconnect();
  }, []);

  // Join Match Request
  const joinMatch = async () => {
    if (!newGame.match) {
      console.log("waiting for match...");
    } else if (!newGame.match.id) {
      console.log("waiting for match id...");
    } else {
      const res = await axios.post(`/match/${newGame.match.id}`);
      if (!res.data) {
        console.log("Waiting for player...");
      } else {
        setNewGame((prevState) => ({
          ...prevState,
          match: res.data.match,
        }));
      }
    }
  };

  const showPlayers = () => {
    return players.map((player, i) => {
      return (
          <p key={i}>player.userId: {player.userId}, player.name: Player Name {player.name}</p>
      );
    });
  };

  useEffect(() => {
    joinMatch();
  }, []);

  //  // Calls API if no locally stored data, with otherwise use local data.
  //  const getNewMatch = async () => {
  //   const res = await axios.get("http://localhost:3001/create-match");
  //   if (!res.data) {
  //     setNewGame(JSON.parse(localStorage.getItem("newGame")));
  // }
  //   console.log(res.data.match);

  // useEffect(() => {
  //   console.log("axios call");
  //   getNewMatch();
  // }, []);

  return (
    <>
      <h2>step2</h2>
      {showPlayers()}
      <p>waiting room as people join. </p>
      <p>
        when players join, they will be added to a state on the host's frontend.
      </p>
      <p>
        once all players have joined, host can click "next" to assign roles.
      </p>
    </>
  );
};

export default StepTwo;
