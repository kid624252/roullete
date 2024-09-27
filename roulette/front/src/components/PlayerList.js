// src/components/PlayerList.js
import React from 'react';
import '../styles/PlayerList.css'; // Import the CSS for styling

const colors=['#8b5cf6','#59b938','#a238b9','#10dbf3'];

const PlayerList = ({ players }) => {
    return (
        <div className="player-list">
            <h3>Players</h3>
            <ul>
                {/* Render each player in the list */}
                {players.map((player, index) => (
                    <li key={index} className="player-item">
                        <span className="player-avatar" style={{ backgroundColor: colors[index] }}>
                            {/* player.color */}
                            {player.player.substring(0, 2).toUpperCase()}
                        </span>
                        <span className="player-name" style={{ marginRight: '10px' }}>{player.player.substring(0, 5)}</span>
                        {/* <span className="player-points">{player.points} Pts</span> */}
                        <span className="player-points" style={{ marginRight: '10px' }}>{100/players.length} Pts</span>
                        {/* <span className="player-share">{player.share} ETH</span> */}
                        <span className="player-share" style={{ marginRight: '10px' }}>{Number(player.amount/1e18).toFixed(3)} ETH</span>

                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlayerList;
