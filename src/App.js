import "./App.css";
import React from "react";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

function App() {
  const [diceState, setDiceState] = React.useState(allNewDice());
  const [rolls, setRolls] = React.useState(0);
  //tenzies hold game state (game or game over)
  const [tenzies, setTenzies] = React.useState(false);
  // check previous high score
  const [prevHighScore, setPrevHighScore] = React.useState(
    () => JSON.parse(localStorage.getItem("bestRolls")) || 0
  );

  React.useEffect(() => {
    const allHeld = diceState.every((die) => die.isHeld);
    // if isHeld is true in every die object in the array
    // .every gets the Boolean
    const firstValue = diceState[0].value;
    const allSameValue = diceState.every((die) => die.value === firstValue);
    //check if all dice are held and all values are same
    //then game won and game over
    if (allHeld && allSameValue) {
      setTenzies(true); //if tenzies is true, game is over

      if (prevHighScore === 0) {
        //if previous highscores is zero, the game has never been played
        localStorage.setItem("bestRolls", JSON.stringify(rolls));
        setPrevHighScore(rolls);
      } else if (prevHighScore > rolls) {
        //compare previous high score with current
        setPrevHighScore(rolls);
        localStorage.setItem("bestRolls", JSON.stringify(rolls));
      } else {
      }
    }
  }, [diceState]);
  // localStorage.setItem("bestRolls", JSON.stringify(0));
  //random dies generator
  function dieGenerator() {
    const num = Math.ceil(Math.random() * 6);
    return {
      id: nanoid(),
      value: num,
      isHeld: false,
    };
  }

  //set our dice with random number max of 6 and push the
  //object of each die into the array

  function allNewDice() {
    const diceArray = [];
    for (let i = 0; i < 10; i++) {
      const num = Math.ceil(Math.random() * 6); //
      diceArray.push(dieGenerator());
    }
    //console.log(diceArray);
    return diceArray;
  }

  function rollDice() {
    if (tenzies) {
      setDiceState(allNewDice());
      // cretes new dice array if the the game is won,its a new game
      // and set tenzies state to false
      setTenzies(false);
      // Set rolls to zero, it
      setRolls(0);
    } else {
      //roll dice again
      setDiceState((prevdice) =>
        prevdice.map((eachdie) => {
          return eachdie.isHeld ? eachdie : dieGenerator();
        })
      );
      //Add 1 to rolls count each time dice is rolled
      setRolls((move) => move + 1);
    }
  }

  //updating the dice that is held or unheld
  function toggleHold(id) {
    setDiceState((prevdice) =>
      prevdice.map((eachdie) => {
        return eachdie.id === id
          ? { ...eachdie, isHeld: !eachdie.isHeld }
          : eachdie;
      })
    );
  }
  const diceElement = diceState.map((item) => (
    <Die
      key={item.id}
      value={item.value}
      isHeld={item.isHeld}
      handleClick={() => toggleHold(item.id)}
    />
  ));
  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElement}</div>
      <div className="row--action">
        <div className="score--wrap">
          <small>Rolls</small>
          <h4>{rolls}</h4>
        </div>
        <button className="roll-dice" onClick={rollDice}>
          {tenzies ? "New Game" : "Roll"}
        </button>
        <div className="score--wrap">
          <small>All-time Best</small>
          <h4>{prevHighScore}</h4>
        </div>
      </div>
    </main>
  );
}

export default App;
