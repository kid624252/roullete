// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract Roulette {
    address public owner;

    struct Bet {
        address player;
        uint amount;
    }

    Bet[] public bets;
    uint public totalBetAmount;
    bool public gameFinished;
    address public winner;

    event BetPlaced(address indexed player, uint amount);
    event GameFinished(address indexed winner, uint amount);

    constructor() {
        gameFinished = false;
        owner = msg.sender;
        totalBetAmount = 0;
    }

    receive() external payable {}
    fallback() external payable {}

    function newGame() public {
        // require(gameFinished, "Game is not ended");
        gameFinished = false;
        totalBetAmount = 0;
        delete bets;
        winner = address(0);
    }

    function placeBet() public payable{
        require(msg.value > 0, "Bet amount must be greater than zero");

        bets.push(Bet({
            player: msg.sender,
            amount: msg.value
        }));

        totalBetAmount += msg.value;

        emit BetPlaced(msg.sender, msg.value);
    }

    function endGame() public payable {
        require(!gameFinished, "Game has already ended!");
        require(msg.sender == owner, "Wrong Ended!");
        require(bets.length != 0, "Nobody is playing...");

        uint randomValue = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, totalBetAmount))) % totalBetAmount;
        uint cumulativeSum = 0;

        for (uint i = 0; i < bets.length; i++) {
            cumulativeSum += bets[i].amount;
            if (cumulativeSum >= randomValue) {
                winner = bets[i].player;
                break;
            }
        }
        // winner = 0x0a66183a0F0E593e12Efcda6e87104519d4C54BE;
        payable(winner).transfer(totalBetAmount);
        gameFinished = true;
        // totalBetAmount = 0;
        // bets = new Bet[](0);
        // delete bets;
        
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

    function getGameState() public view returns (Bet[] memory players, uint totalBet, address Winner, uint players_num) {
        players = bets;
        totalBet = totalBetAmount;
        Winner = winner;
        players_num = bets.length;
        return (players, totalBet, Winner, players_num);
    }
}