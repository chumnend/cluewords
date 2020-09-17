import React, { useEffect } from "react";
import StepOne from "../components/new game/step 1/StepOne.js";
import StepTwo from "../components/new game/step 2/StepTwo.js";
import StepThree from "../components/new game/step 3/StepThree.js";
// import Loading from "../components/new game/Loading.js";
import { useNewGame, usePlayers, useSpyMaster } from "../DataContext";
import {
  Button,
  Container,
  Divider,
  Grid,
  Typography,
  Card,
} from "@material-ui/core";

import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    card: {
      padding: "2rem",
    },
  })
);

const NewGame = (props) => {
  const classes = useStyles();

  //Holds Match ID + Template for Passing Roles to Server
  const newGameContext = useNewGame();
  const [newGame, setNewGame] = newGameContext;

  //Holds All Players + Roles
  const newPlayersContext = usePlayers();
  const [players] = newPlayersContext;

  //Holds Selected SpyMaster
  const newSpyMasterContext = useSpyMaster();
  const [spymaster] = newSpyMasterContext;

  // const gameData = localStorage.getItem("newGame");

  // Calls API if no locally stored data, with otherwise use local data.
  // useEffect(() => {
  //   if (gameData) {
  //     setNewGame(JSON.parse(localStorage.getItem("newGame")));
  //   } else {
  //     axios
  //       .get("/create-match")
  //       .then((response) => {
  //         setNewGame((prevState) => ({
  //           ...prevState,
  //           matchId: response.data.globalState.match.id,
  //         }));
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }, []);

  // Stores New Game Info to Local Storage
  useEffect(() => {
    localStorage.setItem("newGame", JSON.stringify(newGame));
  }, [newGame]);

  const nextStep = () => {
    const { step } = newGame;
    setNewGame((prevState) => ({
      ...prevState,
      step: step + 1,
    }));
  };

  const startGame = async (e) => {
    //LINK TO ROUTE
    e.preventDefault();

    const setMatch = (newGame, players, spyMaster) => {
      let spyMasters = [spyMaster.teamBlue, spyMaster.teamRed];

      let playerAssign = players.map((player) => {
        if (spyMasters.includes(player.id)) {
          console.log(player);
          return {
            id: player.id,
            name: player.name,
            team: player.team,
            spyMaster: true,
          };
        } else {
          return {
            id: player.id,
            name: player.name,
            team: player.team,
            spyMaster: false,
          };
        }
      });

      return {
        matchId: newGame.matchId,
        players: playerAssign,
      };
    };

    let matchDetails = setMatch(newGame, players, spymaster);

    console.log(matchDetails);

    // try {
    //   const { data } = await axios.post('/create-match', {
    //       userName: "jorawar"
    //   });
    //   console.log(data)
    // } catch(err) {
    //     console.log(err);
    // }
  };

  const newGameSteps = () => {
    const { step } = newGame;
    switch (step) {
      // case 0:
      //   return <NewGameLoading />;
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree />;
      default:
        return <h2>Game Starts?</h2>;
    }
  };

  return (
    <Container maxWidth="md">
      <Card className={classes.card}>
        <Typography align="center" variant="h1">
          New Game
        </Typography>

        <Divider />

        {newGameSteps()}

        <Grid container direction="row" justify="center" alignItems="center">
          {newGame.step < 3 ? (
            <Button variant="contained" color="primary" onClick={nextStep}>
              Next
            </Button>
          ) : (
            //Needs Logic here to initiate final role allocation.
            <Button variant="contained" color="primary" onClick={startGame}>
              Create Game
            </Button>
          )}
        </Grid>
      </Card>
    </Container>
  );
};

export default NewGame;
