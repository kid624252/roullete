// src / components / GameWheel.js
import React from 'react';
import { useEffect, useState } from 'react';

// import { PieChart } from 'react-minimal-pie-chart';

import '../styles/GameWheel.css'; // Import the CSS for styling

const GameWheel = ({ players, totalBet }) => {
    // Calculate the angle for each player's section based on the number of players
    const [chartData, setChartData] = useState([
        { title: 'Player 1', value: 10, color: '#E38627' },
        { title: 'Player 2', value: 15, color: '#C13C37' },
        { title: 'Player 3', value: 20, color: '#6A2135' }
    ]);

    const anglePerSection = 360 / players.length;
    //total share: sum of all players' share
    const totalShare = players.reduce((acc, player) => acc +  player.amount, 0);

    useEffect(() => {
        // Update chart data based on players' bets
        if (players.length > 0) {
            const data = players.map((player, index) => ({
                title:  player.player.substring(0, 6) + '...',
                value:  player.amount,
                color: generateColor(index),
            }));
            setChartData(data);
        }
    }, [players]);
    const generateColor = (index) => {
        // Generate colors for pie chart slices
        const colors = ['#8b5cf6', '#22c55e', '#0ea5e9', '#f97316', '#f43f5e'];
        return colors[index % colors.length];
    };
    return (
        //     <div className="game-wheel-container">
        //         <PieChart
        //             // data={players}
        //             lineWidth={25}
        //             paddingAngle={5}
        //             rounded
        //             animate
        //             // label={({ dataEntry }) => `${(dataEntry.value / totalBet * 100).toFixed(1)}%`}
        //             labelStyle={{
        //                 fontSize: '5px',
        //                 fill: '#fff',
        //             }}
        //         />
        //         <div className="game-wheel-center">
        //             <div className="bet-total">
        //                 <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH" width="20" />
        //                 <span>{totalBet} ETH</span>
        //             </div>
        //             <p>Generating Randomness...</p>
        //         </div>
        //     </div>
        // );
        <div className="game-wheel">
            {/* Render each player's section in the wheel */}
            {players.map((player, index) => (
                <div
                    key={index}
                    className="wheel-section"
                    style={{
                        transform: `rotate(${index * anglePerSection}deg)`,
                        // transform: `rotate(${ player.amount / totalShare * 360}deg)`,
                        // anglePerSection
                        backgroundColor: '#0ea5e9', // Set a unique color for each player
                    }}
                >
                    {/* <span className="player-info">
                        { player.player} <br /> { player.amount} ETH
                    </span> */}
                </div>
            ))}
            <div className="game-wheel-center">
                <div className="bet-total">
                    <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH" width="34" />
                    <span>{totalBet} ETH</span>
                </div>
                <p>Generating Randomness...</p>
            </div>
        </div>
    );
};

export default GameWheel;










// import React from 'react';
// import { PieChart } from 'react-minimal-pie-chart';

// const GameWheel = ({ players, totalBet }) => {
//     // Prepare data for the pie chart
//     const chartData = players.map((player, index) => ({
//         title: player.playerAddress.substring(0, 6) + '...',
//         value: player.betAmount,
//         color: generateColor(index),
//     }));

//     // Generate distinct colors for each player's slice
//     function generateColor(index) {
//         const colors = ['#8b5cf6', '#22c55e', '#0ea5e9', '#f97316', '#f43f5e'];
//         return colors[index % colors.length];
//     }

//     return (
//         <div className="game-wheel-container">
//             <PieChart
//                 data={chartData}
//                 lineWidth={25}
//                 paddingAngle={5}
//                 rounded
//                 animate
//                 label={({ dataEntry }) => `${((dataEntry.value / totalBet) * 100).toFixed(1)}%`}
//                 labelStyle={{
//                     fontSize: '5px',
//                     fill: '#fff',
//                 }}
//             />
//             <div className="game-wheel-center">
//                 <div className="bet-total">
//                     <img
//                         src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
//                         alt="ETH"
//                         width="20"
//                         style={{ verticalAlign: 'middle', marginRight: '5px' }}
//                     />
//                     <span>{totalBet} ETH</span>
//                 </div>
//                 <p>Generating Randomness...</p>
//             </div>
//         </div>
//     );
// };

// export default GameWheel;











// import React, { useEffect, useState } from 'react';
// import { PieChart } from 'react-minimal-pie-chart';

// const GameWheel = ({ players, totalBet }) => {
//     const [chartData, setChartData] = useState([]);

//     useEffect(() => {
//         // Update chart data based on players' bets
//         if (players.length > 0) {
//             const data = players.map((player, index) => ({
//                 title: player.playerAddress.substring(0, 6) + '...',
//                 value: player.betAmount,
//                 color: generateColor(index),
//             }));
//             setChartData(data);
//         }
//     }, [players]);

//     const generateColor = (index) => {
//         // Generate colors for pie chart slices
//         const colors = ['#8b5cf6', '#22c55e', '#0ea5e9', '#f97316', '#f43f5e'];
//         return colors[index % colors.length];
//     };

//     return (
//         <div className="game-wheel-container">
//             <PieChart
//                 data={chartData}
//                 lineWidth={25}
//                 paddingAngle={5}
//                 rounded
//                 animate
//                 label={({ dataEntry }) => `${(dataEntry.value / totalBet * 100).toFixed(1)}%`}
//                 labelStyle={{
//                     fontSize: '5px',
//                     fill: '#fff',
//                 }}
//             />
//             <div className="game-wheel-center">
//                 <div className="bet-total">
//                     <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH" width="20" />
//                     <span>{totalBet} ETH</span>
//                 </div>
//                 <p>Generating Randomness...</p>
//             </div>
//         </div>
//     );
// };

// export default GameWheel;
