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
                        <span className="player-avatar" style={{ backgroundColor: player.color }}>
                            {player.name.substring(0, 2).toUpperCase()}
                        </span>
                        <span className="player-name">{player.name}</span>
                        <span className="player-points">{player.points} Pts</span>
                        <span className="player-share">{player.share} ETH</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlayerList;
