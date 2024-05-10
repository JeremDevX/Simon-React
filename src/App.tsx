import SimonBtn from "./SimonBtn";
import { useState, useEffect } from "react";

const colors = ["red", "blue", "green", "yellow"];

type Colorsound = "red" | "blue" | "green" | "yellow";
const sounds: Record<Colorsound, HTMLAudioElement> = {
  red: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
  blue: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
  green: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
  yellow: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
};

export default function App() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [sequenceIndex, setSequenceIndex] = useState(-1);
  const [gameStarted, setGameStarted] = useState(false);

  const addNewColor = () => {
    const color = colors[Math.floor(Math.random() * 4)];
    const newSequence = [...sequence, color];
    setSequence(newSequence);
    setSequenceIndex(-1);
    setUserSequence([]);
  };

  function playSound(color: string) {
    sounds[color as Colorsound].currentTime = 0;
    sounds[color as Colorsound].play();
  }

  function playsSequence() {
    for (let i = 0; i < sequence.length; i++) {
      setTimeout(() => {
        const currentButton = document.getElementById(`${sequence[i]}`);
        playSound(sequence[i]);
        currentButton?.classList.add("highlight");

        setTimeout(() => {
          currentButton?.classList.remove("highlight");
        }, 750);
      }, i * 1000);
    }
  }

  function handleClick(color: string) {
    if (gameStarted) {
      const newUserSequence = [...userSequence, color];
      setUserSequence(newUserSequence);
    }
  }

  useEffect(() => {
    if (gameStarted) {
      if (userSequence[sequenceIndex] === sequence[sequenceIndex]) {
        setSequenceIndex(sequenceIndex + 1);
        if (userSequence.length === sequence.length) {
          setTimeout(addNewColor, 1000);
        }
      } else {
        alert("You lost!");
        setSequence([]);
        setUserSequence([]);
        setSequenceIndex(-1);
        setGameStarted(false);
      }
    }
  }, [userSequence, gameStarted]);

  useEffect(() => {
    if (sequence.length > 0) {
      playsSequence();
    }
  }, [sequence]);

  function playGame() {
    if (!gameStarted) {
      setGameStarted(true);
    }
  }

  return (
    <div className="App">
      <SimonBtn
        color="red"
        id="red"
        onClick={() => {
          handleClick("red");
          playSound("red");
        }}
      />
      <SimonBtn
        color="blue"
        id="blue"
        onClick={() => {
          handleClick("blue");
          playSound("blue");
        }}
      />
      <SimonBtn
        color="green"
        id="green"
        onClick={() => {
          handleClick("green");
          playSound("green");
        }}
      />
      <SimonBtn
        color="yellow"
        id="yellow"
        onClick={() => {
          handleClick("yellow");
          playSound("yellow");
        }}
      />
      <div className="container">
        <button className="play" onClick={playGame}>
          PLAY
        </button>
        <div className="cheat-test">
          <p className="game-sequence">{`${sequence} `}</p>
          <p className="user-sequence">{`${userSequence} `}</p>
        </div>
      </div>
    </div>
  );
}
