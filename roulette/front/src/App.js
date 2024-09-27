// App.js
import React, { useState, useEffect, useRef } from 'react';
import PlayerList from './components/PlayerList'; // Player list component
import GameWheel from './components/GameWheel';   // Game wheel component
import Timer from './components/Timer';           // Timer component
import { connectWallet, placeBet, getGameState, listenForBetPlacedEvent, endgame, listenForAccountChanges, newgame } from './components/web3'; // Web3 utilities

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
  const [betAmount, setBetAmount] = useState(0);
  const timerRef = useRef(null); // Reference to store the timer interval
  const isDeterminingWinner = useRef(false); // Reference to prevent multiple calls to determineWinner

  useEffect(() => {
    // This useEffect hook runs once when the component mounts
    // Function to connect the wallet and load initial data
    const initialize = async () => {
      const account = await connectWallet();
      if (account) {
        setAccount(account);
        setIsConnected(true);
        // Load initial game data (players, rounds, etc.)
        // loadGameData();
      }
    };

    initialize();

    // Fetch initial game state from the contract
    updateGameState();

    // Listen for new bets being placed and update game state accordingly
    // listenForBetPlacedEvent(updateGameState);
    listenForAccountChanges((newAccount) => {
      setAccount(newAccount);
    });

    // Start the timer countdown when the component mounts
    startTimer();

    return () => {
      // Cleanup listeners when the component unmounts
      // clearInterval(timerInterval);
      clearInterval(timerRef.current);
    };
  }, []);

  const loadGameData = () => {
    // Load players and current round data from your backend or smart contract
    // This is a placeholder for loading data logic
    setPlayers([
      { player: 'A57388', amount: 500 },
      { player: 'MercyKiller88', amount: 500 },
      { player: 'eEaF71', amount: 500 },
      { player: '2E17B5', amount: 500 },
    ]);
    setCurrentRound({
      totalPool: 0.04,
      prize: 91.45
    });
  };

  const handlePlaceBet = async () => {
    if (!account) {
      alert('Please connect your wallet first.');
      return;
    }

    if (!betAmount || isNaN(betAmount) || betAmount <= 0) {
      alert('Please enter a valid bet amount.');
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
    setCurrentRound({
      totalPool: gameState.totalBet / 1e18,
      prize: gameState.totalBet / 1e18 * 2659
    });
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current); // Clear any existing timer
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        // console.log(prevTime);
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          determineWinner(); // Determine the winner when the timer reaches zero
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); // Countdown every second
  };

  const determineWinner = async () => {
    if (isDeterminingWinner.current) return; // Prevent multiple calls
    isDeterminingWinner.current = true;

    try {
      const check = await getGameState();
      console.log("state:", check.totalBet, check.players)
      if (check.players != 0) {
        console.log("Time to end!");
        await endgame();
        const gameState = await getGameState(); // Assuming contract returns winner after round ends
        setWinner(gameState.Winner);
        alert(`The winner is: ${gameState.Winner}`);
        await newgame();
        setWinner(null);
        setCurrentRound({
          totalPool: 0,
          prize: 0
        });
      }
      // Refresh the game state for the next round
      updateGameState();
      setTimeLeft(60); // Reset the timer for the next round
      startTimer(); // Start a new round
    } catch (error) {
      console.error('Error determining winner:', error);
    } finally {
      isDeterminingWinner.current = false; // Reset the flag
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
            {/* <button onClick={() => handlePlaceBet(0.01)}>Place Bet (0.01 ETH)</button> */}
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder="Enter bet amount (ETH)"
              step="0.01"
              style={{ textAlign: 'right', width: '50px', marginRight: '10px' }}
            />
            <button onClick={handlePlaceBet}>Place Bet(ETH)</button>
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