import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const emojis = ["🍕", "🥩", "🍥", "🍩", "🍉", "🍏"];
  const [emojiPack, setEmojiPack] = useState(() =>
    [...emojis, ...emojis].sort(() => Math.random() - 0.5)
  );
  const [flippedCards, setFlippedCards] = useState([]);
  const [lock, setLock] = useState(false);
  const [pairs, setPairs] = useState([]);
  const [blink, setBlink] = useState(false);
  const [score, setScore] = useState(0);
  const [resting, setResting] = useState(false);
  const [time, setTime] = useState(0);
  const timeStarted = useRef(false);
  const timeRefId = useRef(null);

  const flip = (index) => {
    if (flippedCards.includes(index) || lock) {
      return;
    }
    setFlippedCards([...flippedCards, index]);
    if (!timeStarted.current) {
      timeStarted.current = true;
      timeRefId.current = setInterval(() => {
        setTime((prev) => +(prev + 0.01).toFixed(2));
      }, 10);
    }
  };

  useEffect(() => {
    if (pairs.length == 12) {
      stopTimer();
    }
    if (flippedCards.length == 2) {
      setLock(true);
      const [firsIndex, secondIndex] = flippedCards;
      if (emojiPack[firsIndex] == emojiPack[secondIndex]) {
        setPairs((prev) => [...prev, firsIndex, secondIndex]);
        setFlippedCards([]);
        setLock(false);
      } else
        setTimeout(() => {
          setLock(false);
          setFlippedCards([]);
        }, 500);
    }
  }, [flippedCards]);
  const stopTimer = () => {
    clearInterval(timeRefId.current);
    timeStarted.current = false;
  };
  const reset = () => {
    if (resting) return;

    setResting(true);
    setPairs([]);
    setFlippedCards([]);
    setScore(0);

    const shuffled = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    setEmojiPack(shuffled);
    setBlink(true);
    stopTimer();
    setTime(0);
    setTimeout(() => {
      setBlink(false);
    }, 700);

    setTimeout(() => {
      setResting(false);
    }, 1000);
  };
  const upScore = (index) => {
    if (flippedCards.includes(index)) {
      return;
    } else {
      setScore((prev) => (prev += 1));
    }
  };
  const startTimer = () => {};
  return (
    <div className="app">
      <div className="result-container">
        <div className="score">{score}</div>
        <div className="timer">{time.toFixed(2)}</div>
      </div>
      <div className="board">
        {emojiPack.map((emoji, index) => {
          return (
            <div
              className="card-container"
              key={index}
              onClick={() => {
                flip(index);
                upScore(index);
              }}
            >
              <div
                className={`card ${
                  flippedCards.includes(index) || pairs.includes(index) || blink
                    ? "flipped"
                    : ""
                }`}
              >
                <div className={`front`}></div>
                <div className={`back`}>{emoji}</div>
              </div>
            </div>
          );
        })}
      </div>
      <button
        className="restart"
        onClick={() => {
          reset();
        }}
      >
        restart
      </button>
    </div>
  );
}

export default App;
