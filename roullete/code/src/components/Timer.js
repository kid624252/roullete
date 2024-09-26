// src/components/Timer.js
import React, { useState, useEffect } from 'react';
import '../styles/Timer.css'; // Import the CSS for styling
import { endgame } from './web3'; // Import the casino contract instance

const Timer = ({ timeLeft }) => {
    const [remainingTime, setRemainingTime] = useState(timeLeft);

    useEffect(() => {
        // Set up a timer to decrease the remaining time
        const timerInterval = setInterval(() => {
            if (remainingTime <= 50) {
                // Handle timer expiration logic here
                console.log("12345");
                endgame();
            }
            // console.log("12345");
            // setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 60));
            setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 60));
            
        }, 1000);

        // Cleanup the interval on component unmount
        return () => clearInterval(timerInterval);
    }, []);

    // Convert time from seconds to MM:SS format
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="timer">
            <h3>Time Left</h3>
            <div className="time-display">{formatTime(remainingTime)}</div>
        </div>
    );
};

export default Timer;
