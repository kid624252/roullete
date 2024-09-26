// App.js
import React, { useState, useEffect } from 'react';
import PlayerList from './components/PlayerList'; // Player list component
import GameWheel from './components/GameWheel';   // Game wheel component
import {Timer, remainingTime} from './components/Timer';           // Timer component
import { connectWallet, placeBet, getGameState, listenForBetPlacedEvent } from './components/web3'; // Web3 utilities

import './App.css'; // Main CSS styles

const App = () => {
  // the syntax of the above line App = () => { is a shorthand for defining a function component in React.
  const [players, setPlayers] = useState([]);  // State for player list
  const [currentRound, setCurrentRound] = useState(null);  // State for current round info
  const [account, setAccount] = useState(null);  // State for user wallet address
  const [isConnected, setIsConnected] = useState(false); // State for wallet connection
  const [totalBet, setTotalBet] = useState(0); // Total bet amount in the pool
  const [winner, setWinner] = useState(null); // The winner of the round
  const [timeLeft, setTimeLeft] = useState(60); // Timer countdown (60 seconds)
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    // This useEffect hook runs once when the component mounts
    // Function to connect the wallet and load initial data
    const initialize = async () => {
      const account = await connectWallet();
      if (account) {
        setAccount(account);
        setIsConnected(true);
        // Load initial game data (players, rounds, etc.)
        loadGameData();
      }
    };

    initialize();

    // Fetch initial game state from the contract
    fetchGameState();

    // Listen for new bets being placed and update game state accordingly
    // listenForBetPlacedEvent(updateGameState);

    // Start the timer countdown when the component mounts
    startTimer();

    return () => {
      // Cleanup listeners when the component unmounts
      // clearInterval(timerInterval);
    };
  }, []);

  const loadGameData = () => {
        // Load players and current round data from your backend or smart contract
        // This is a placeholder for loading data logic
        setPlayers([
          // { name: 'A57388', points: 500, share: 0.01, color: '#8b5cf6' },
          // { name: 'MercyKiller88', points: 500, share: 0.01, color: '#22c55e' },
          // { name: 'eEaF71', points: 500, share: 0.01, color: '#0ea5e9' },
          // { name: '2E17B5', points: 500, share: 0.01, color: '#f97316' },
          { player: 'A57388', amount: 500 },
          { player: 'MercyKiller88', amount: 500 },
          { player: 'eEaF71', amount: 500 },
          { player: '2E17B5', amount: 500 },
        ]);
        setCurrentRound({
          totalPool: 0.04,
          prize: 91.45,
          timeLeft: 70, // Time in seconds
        });
      };
  // const handlePlaceBet = async (amount) => {
  //   if (!isConnected) {
  //     alert('Please connect your wallet first!');
  //     return;
  //   }
  //   // Place a bet through the smart contract using web3 utilities
  //   await placeBet(amount);
  // };




  const fetchGameState = async () => {
    const gameState = await getGameState();
    setPlayers(gameState.players); // Assuming the contract returns an array of players
    setTotalBet(gameState.totalBet); // Total bet amount in the contract
  };

  const handlePlaceBet = async (betAmount) => {
    if (!account) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      const receipt = await placeBet(betAmount, account);
      console.log('Bet placed:', receipt);
      updateGameState(); // Update game state after placing a bet
    } catch (error) {
      console.error('Error placing bet:', error);
    }
  };

  const updateGameState = async () => {
    const gameState = await getGameState();
    setPlayers(gameState.players);
    setTotalBet(gameState.totalBet);
  };

  const startTimer = () => {
    const timerInterval = setInterval(() => {
      if (remainingTime<=1) {
        // clearInterval(timerInterval);
        determineWinner();
      } 
    }, 1000); // Countdown every second
  };

  const determineWinner = async () => {
    try {
      const gameState = await getGameState(); // Assuming contract returns winner after round ends
      setWinner(gameState.Winner);
      alert(`The winner is: ${gameState.Winner}`);
      // Refresh the game state for the next round
      fetchGameState();
      setTimeLeft(60); // Reset the timer for the next round
      startTimer(); // Start a new round
    } catch (error) {
      console.error('Error determining winner:', error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Web3 Casino Game</h1>

      </header>
      <div className="game-container">                {/* Player List Section */}
        <PlayerList players={players} />

        {/* Game Wheel Section */}
        <GameWheel players={players} totalBet={totalBet} />




        {/* Timer and Betting Section */}
        <div className="game-info">
          {/* <Timer timeLeft={currentRound?.timeLeft || 0} /> */}
          <Timer timeLeft={timeLeft} />
          <div className="betting-section">
            <h2>Round {currentRound?.roundNumber || 'Loading...'}</h2>
            <button onClick={() => handlePlaceBet(0.01)}>Place Bet (0.01 ETH)</button>
            <p>Total Pool: {currentRound?.totalPool} ETH</p>
            <p>Prize: ${currentRound?.prize}</p>
          </div>
        </div>
      </div>
      {/* {!isConnected && (
        <button className="connect-button" onClick={connectWallet}>
          Connect Wallet
        </button>
      )} */}
      {account ? (
        <p>Connected account: {account}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
      {winner && <div className="winner-section">Winner: {winner}</div>}
    </div>
  );
};

export default App;


// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
