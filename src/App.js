import React, { useState, useEffect } from 'react';
import './App.css';

const Button = props => {
  return (
    <button
      className="number"
      style={{ backgroundColor: colors[props.status] }}
      onClick={() => props.onClick(props.number, props.status)}>
      {props.number}
    </button>
  )
}

const Stars = props => {
  return utils.range(1, props.count).map(starId =>
    <div className="star" key={starId} />
  )
}

const PlayAgain = (props) => {
  return (
    <div className="game-done">
      <div className="message" style={{ color: props.gameStatus === "lost" ? "red" : "green" }}>{props.gameStatus === "lost" ? "No time left :(" : "You Won!"}</div>
      <button onClick={props.onClick}>Play</button>
    </div>
  )
}

const App = () => {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(15)

  useEffect(() => {
    if (secondsLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1)
      }, 1000)
      return () => clearTimeout(timerId)
    }
  })

  const gameStatus = availableNums.length === 0 ? "won" : secondsLeft === 0 ? "lost" : "inProgress"

  const candidatesAreWrong = utils.sum(candidateNums) > stars

  const resetGame = () => {
    setStars(utils.random(1, 9))
    setAvailableNums(utils.range(1, 9))
    setCandidateNums([])
    setSecondsLeft(15)
  }

  const numberStatus = (number) => {
    if (!availableNums.includes(number)) {
      return "used"
    }
    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? "wrong" : "candidate"
    }
    return "available"
  }

  const onButtonClick = (number, currentStatus) => {
    if (currentStatus === "used" || gameStatus !== "inProgress") {
      return;
    }
    const newCandidateNums =
      currentStatus === "available"
        ? candidateNums.concat(number)
        : candidateNums.filter(cn => cn !== number)

    if (utils.sum(newCandidateNums) !== stars) {
      setCandidateNums(newCandidateNums)
    } else {
      const newAvailableNums = availableNums.filter(
        num => !newCandidateNums.includes(num)
      )
      setStars(utils.randomSumIn(newAvailableNums, 9))
      setAvailableNums(newAvailableNums)
      setCandidateNums([])
    }
  }

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== "inProgress"
            ? <PlayAgain onClick={resetGame} gameStatus={gameStatus} />
            : <Stars count={stars} />
          }
        </div>
        <div className="right">
          {utils.range(1, 9).map(number =>
            <Button
              key={number}
              status={numberStatus(number)}
              number={number}
              onClick={onButtonClick} />
          )}

        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
}
// Colors
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// Math
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(max * Math.random()),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length)];
  },
};

export default App;
