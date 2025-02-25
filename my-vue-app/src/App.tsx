import { useState, useEffect } from 'react';
import './App.css';
import Button from './components/buttons/button';

function App() {
  const [count, setCount] = useState(0);
  const [position, setPosition] = useState({ top: 50, left: 50 });
  const [timer, setTimer] = useState(0);
  const [highScores, setHighScores] = useState([]);
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    let interval;
    if (count > 0 && count < 10) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 100); 
      }, 100);
    }

    return () => clearInterval(interval);
  }, [count]);

  const handleClick = () => {
    if (count < 10) {
      setCount((prevCount) => prevCount + 1);
      const newTop = Math.random() * (window.innerHeight - 50);
      const newLeft = Math.random() * (window.innerWidth - 100);
      setPosition({ top: newTop, left: newLeft });
    }
  };

  const handleReset = () => {
    setCount(0);
    setTimer(0);
    setPosition({ top: 50, left: 50 });
    setPlayerName('');
  };

  const handleSubmit = () => {
    if (playerName && count === 10) {
      setHighScores((prevScores) => {
        const newScores = [
          ...prevScores,
          { name: playerName, time: (timer / 1000).toFixed(2) } 
        ].sort((a, b) => a.time - b.time);
        return newScores.slice(0, 5);
      });
      setPlayerName('');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Clicking Game',
        text: `I scored ${count} clicks in ${(timer / 1000).toFixed(2)} seconds! Can you beat me?`,
        url: window.location.href,
      })
      .then(() => console.log('Share successful'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Sharing is not supported in this browser.');
    }
  };

  return (
    <>
      <div className="card" style={{ position: 'absolute', top: position.top, left: position.left }}>
        <Button count={count} onClick={handleClick} />
      </div>
      {count > 0 && count < 10 && <div>Timer: {(timer / 1000).toFixed(2)}s</div>}
      {count === 10 && (
        <>
          <div>Final Time: {(timer / 1000).toFixed(2)}s</div>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
          />
          <button onClick={handleSubmit}>Submit Score</button>
  
          {}
          <div>
            <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=I scored ${count} clicks in ${(timer / 1000).toFixed(2)} seconds! Can you beat me? ${window.location.href}`, '_blank')}>
              Share on Twitter
            </button>
            <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}>
              Share on Facebook
            </button>
            <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}>
              Share on LinkedIn
            </button>
          </div>
        </>
      )}
      <button onClick={handleReset}>Reset</button>
      <div>
        <h3>High Scores</h3>
        <ul>
          {highScores.map((score, index) => (
            <li key={index}>{score.name}: {score.time}s</li>
          ))}
        </ul>
      </div>
    </>
  );
  
}

export default App;
