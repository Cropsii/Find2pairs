import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const emojis = ["🍕", "🥩", "🍥", "🍩", "🍉", "🍏"];
  const [emojiPack, setEmojiPack] = useState(() =>
    [...emojis, ...emojis].sort(() => Math.random() - 0.5)
  );
  const [flippedCards, setFlippedCards] = useState([]);
  const [lock, setLock] = useState(false);
  const [pairs, setPairs] = useState([]);
  const [blink, setBlink] = useState(true);
  const [score, setScore] = useState(0);
  const flip = (index) => {
    if (flippedCards.includes(index) || lock) {
      return;
    }
    setFlippedCards([...flippedCards, index]);
  };
  useEffect(() => {
    setTimeout(() => {
      setBlink(false);
    }, 700);
  }, [blink]);
  useEffect(() => {
    if (flippedCards.length == 2) {
      setLock(true);
      const [firsIndex, secondIndex] = flippedCards;
      if (emojiPack[firsIndex] == emojiPack[secondIndex]) {
        setPairs((prev) => [...prev, firsIndex, secondIndex]);
        setFlippedCards([]);
        setLock(false);
      } else
        setTimeout(() => {
          setFlippedCards([]);
          setLock(false);
        }, 500);
    }
  }, [flippedCards]);
  const reset = () => {
    setEmojiPack((prev) => prev.sort(() => Math.random() - 0.5));
    setBlink(true);
    setFlippedCards([]);
    setScore(0);
    setTimeout(() => {
      setPairs([]);
    }, 100);
  };
  const upScore = (index) => {
    if (flippedCards.includes(index)) {
      return;
    } else {
      setScore((prev) => (prev += 1));
    }
  };
  return (
    <div className="app">
      <div className="score">{score}</div>
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
