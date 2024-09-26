// src/components/PlayerList.js
import React from 'react';
import '../styles/PlayerList.css'; // Import the CSS for styling

const PlayerList = ({ players }) => {
    return (
        <div className="player-list">
            <h3>Players</h3>
            <ul>
                {/* Render each player in the list */}
                {players.map((player, index) => (
                    <li key={index} className="player-item">
                        <span className="player-avatar" style={{ backgroundColor: '#8b5cf6' }}>
                            {/* player.color */}
                            {player.player.substring(0, 2).toUpperCase()}
                        </span>
                        <span className="player-name">{player.player}</span>
                        {/* <span className="player-points">{player.points} Pts</span> */}
                        <span className="player-points">{player.amount} Pts</span>
                        {/* <span className="player-share">{player.share} ETH</span> */}
                        <span className="player-share">{0.25} ETH</span>

                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlayerList;
