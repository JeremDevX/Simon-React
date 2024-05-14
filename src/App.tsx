import SimonBtn from "./components/SimonBtn";
import { useState, useEffect, useCallback } from "react";

const colors = ["red", "blue", "green", "yellow"];

type Colorsound = "red" | "blue" | "green" | "yellow";
const sounds: Record<Colorsound, HTMLAudioElement> = {
  red: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
  blue: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
  green: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
  yellow: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
};

const addNewColor = () => {
  const color = colors[Math.floor(Math.random() * 4)];
  return color;
};

export default function App() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [activeColor, setActiveColor] = useState<string | null>(null);

  function playGame() {
    if (!gameStarted) {
      setGameStarted(true);
    }
  }

  function playSound(color: string) {
    sounds[color as Colorsound].currentTime = 0;
    sounds[color as Colorsound].play();
  }

  function playsSequence() {
    let i = 0;

    const interval = setInterval(() => {
      playSound(sequence[i]);
      setActiveColor(sequence[i]);
      setTimeout(() => {
        setActiveColor(null);
      }, 750);
      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
      }
    }, 1000);
  }

  const handleClick = useCallback(
    (color: string) => {
      if (gameStarted) {
        if (sequence[sequenceIndex] === color) {
          setSequenceIndex(sequenceIndex + 1);
        } else {
          alert("You lost!");
          setSequence([]);
          setSequenceIndex(0);
          setGameStarted(false);
        }
      }
    },
    [sequenceIndex, gameStarted, sequence]
  );

  useEffect(() => {
    if (gameStarted) {
      if (sequence.length === 0) {
        setSequence([...sequence, addNewColor()]);
      } else {
        if (sequence.length === sequenceIndex) {
          setSequenceIndex(0);
          setTimeout(() => {
            setSequence([...sequence, addNewColor()]);
          }, 1000);
        }
      }
    }
  }, [gameStarted, sequenceIndex]);

  useEffect(() => {
    if (gameStarted) {
      if (sequence.length > 0) {
        playsSequence();
      }
    }
  }, [gameStarted, sequence]);

  return (
    <div className="App">
      {colors.map((color) => (
        <SimonBtn
          key={"button" + color}
          color={color}
          id={color}
          onClick={() => {
            handleClick(color);
            playSound(color);
          }}
          active={activeColor === color}
        />
      ))}
      <div className="container">
        <button className="play" onClick={playGame}>
          PLAY
        </button>
        <div className="cheat-test">
          <p className="game-sequence">{`${sequence} `}</p>
        </div>
      </div>
    </div>
  );
}
