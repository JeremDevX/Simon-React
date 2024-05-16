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

const getNewColor = () => {
  const color = colors[Math.floor(Math.random() * 4)];
  return color;
};

export default function App() {
  const [sequence, setSequence] = useState<string[]>([getNewColor()]);
  const [sequenceIndex, setSequenceIndex] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [iaTurn, setIaTurn] = useState<boolean>(true);
  const [stopHighlight, setStopHighlight] = useState<boolean>(true);

  function playGame() {
    if (!gameStarted) {
      setGameStarted(true);
    }
  }

  function playSound(color: string) {
    sounds[color as Colorsound].currentTime = 0;
    sounds[color as Colorsound].play();
  }

  const handleClick = useCallback(
    (color: string) => {
      if (gameStarted && !iaTurn) {
        if (sequence[sequenceIndex] === color) {
          setSequenceIndex(sequenceIndex + 1);
        } else {
          alert("You lost!");
          setSequence([getNewColor()]);
          setSequenceIndex(0);
          setGameStarted(false);
          setIaTurn(true);
        }
      }
    },
    [sequenceIndex, gameStarted, sequence, iaTurn]
  );

  useEffect(() => {
    let waitChangePLayer: number;
    if (!iaTurn) {
      if (sequenceIndex === sequence.length) {
        waitChangePLayer = setTimeout(() => {
          setIaTurn(true);
          setSequenceIndex(0);
          setSequence([...sequence, getNewColor()]);
        }, 1000);
      }
    }
    return () => {
      clearTimeout(waitChangePLayer);
    };
  }, [sequence, sequenceIndex, iaTurn]);

  useEffect(() => {
    let stopHighlight: number;
    let incrementIndex: number;
    if (gameStarted && iaTurn) {
      if (sequenceIndex < sequence.length) {
        playSound(sequence[sequenceIndex]);
        setStopHighlight(false);
        stopHighlight = setTimeout(() => {
          setStopHighlight(true);
        }, 750);
        incrementIndex = setTimeout(() => {
          setSequenceIndex(sequenceIndex + 1);
        }, 1000);
      }
      if (sequenceIndex === sequence.length) {
        setIaTurn(false);
        setSequenceIndex(0);
      }
    }
    return () => {
      clearTimeout(stopHighlight);
      clearTimeout(incrementIndex);
    };
  }, [gameStarted, sequenceIndex, iaTurn, sequence]);

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
          sequence={
            sequence[sequenceIndex] === color &&
            iaTurn &&
            gameStarted &&
            !stopHighlight
          }
          style={{ pointerEvents: iaTurn ? "none" : "auto" }}
        />
      ))}
      <div className="container">
        <button className="play" onClick={playGame}>
          PLAY
        </button>
        <div className="cheat-test">
          <p className="game-sequence">
            Cheat Reminder : {`${gameStarted ? sequence : ""} `}
          </p>
          <p>
            <br />
            <br />
            <br />
            <br />
            {iaTurn ? "IA Turn" : "Player Turn"}
          </p>
        </div>
      </div>
    </div>
  );
}
