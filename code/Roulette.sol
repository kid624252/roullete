// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Roulette {
    uint interval;
    address owner;

    struct Bet {
        address player;
        uint amount;
    }

    Bet[] public bets;
    uint public totalBetAmount;
    uint public bettingEndTime;
    bool public gameFinished;
    address public winner;

    event BetPlaced(address indexed player, uint amount);
    event GameFinished(address indexed winner, uint amount);

    constructor() {
        gameFinished = false;
        owner = msg.sender;
        interval = 1 minutes;
        bettingEndTime = block.timestamp + interval;
        totalBetAmount = 0;
    }

    modifier onlyBeforeEnd() {
        require(block.timestamp < bettingEndTime, "Betting time has ended");
        _;
    }

    modifier onlyAfterEnd() {
        require(block.timestamp >= bettingEndTime, "Betting time is still ongoing");
        _;
    }

    function placeBet() public payable onlyBeforeEnd {
        require(msg.value > 0, "Bet amount must be greater than zero");

        bets.push(Bet({
            player: msg.sender,
            amount: msg.value
        }));

        totalBetAmount += msg.value;

        emit BetPlaced(msg.sender, msg.value);
    }

    function endGame() public onlyAfterEnd {
        require(!gameFinished, "Game has already ended");

        uint randomValue = uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, totalBetAmount))) % totalBetAmount;
        uint cumulativeSum = 0;

        for (uint i = 0; i < bets.length; i++) {
            cumulativeSum += bets[i].amount;
            if (cumulativeSum > randomValue) {
                winner = bets[i].player;
                break;
            }
        }

        payable(winner).transfer(totalBetAmount);
        gameFinished = true;
        totalBetAmount = 0;
        bettingEndTime += interval;
        // bets = new Bet[](0);
        delete bets;
        
        emit GameFinished(winner, totalBetAmount);
    }

    function getBetCount() public view returns (uint) {
        return bets.length;
    }

    function getBet(uint index) public view returns (address player, uint amount) {
        require(index < bets.length, "Index out of bounds");
        Bet storage bet = bets[index];
        return (bet.player, bet.amount);
    }

    function getGameState() public view returns (Bet[] memory players, uint totalBet, address Winner) {
        players = bets;
        totalBet = totalBetAmount;
        Winner = winner;
        return (players, totalBet, Winner);
    }
}