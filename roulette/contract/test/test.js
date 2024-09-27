// const Roulette = artifacts.require("Roulette");

// contract("Roulette", (accounts) => {
//     let rouletteInstance;

//     beforeEach(async () => {
//         rouletteInstance = await Roulette.new();
//     });

//     it("place bets", async () => {
//         await rouletteInstance.newBet({ from: accounts[1], value: web3.utils.toWei("0.1", "ether") });
//         await rouletteInstance.newBet({ from: accounts[2], value: web3.utils.toWei("0.2", "ether") });

//         const betCount = await rouletteInstance.getBetCount();
//         assert.equal(betCount.toNumber(), 2, "Bet count should be 2");

//         const bet1 = await rouletteInstance.getBet(0);
//         assert.equal(bet1.player, accounts[1], "First bet should be from account 0");
//         assert.equal(bet1.amount.toString(), web3.utils.toWei("0.1", "ether"), "First bet amount should be 1 ether");

//         const bet2 = await rouletteInstance.getBet(1);
//         assert.equal(bet2.player, accounts[2], "Second bet should be from account 1");
//         assert.equal(bet2.amount.toString(), web3.utils.toWei("0.2", "ether"), "Second bet amount should be 2 ether");
//     });

//     it("end the game and select a winner", async () => {
//         await rouletteInstance.newBet({ from: accounts[3], value: web3.utils.toWei("0.1", "ether") });
//         await rouletteInstance.newBet({ from: accounts[4], value: web3.utils.toWei("0.2", "ether") });

//         // Increase time to simulate the end of the betting period
//         await new Promise(resolve => setTimeout(resolve, 60000));

//         await rouletteInstance.endGame({ from: accounts[4] });

//         const gameEnded = await rouletteInstance.gameFinished();
//         assert.equal(gameEnded, true, "Game should be ended");

//         const winner = await rouletteInstance.winner();
//         assert.notEqual(winner, "0x0000000000000000000000000000000000000000", "Winner should be selected");

//         const winnerBalance = await web3.eth.getBalance(winner);
//         console.log(`Winner balance: ${web3.utils.fromWei(winnerBalance, "ether")} ether`);
//     });
// });

// test/test.js
const Roulette = artifacts.require("Roulette");

contract("Roulette", (accounts) => {
    let rouletteInstance;

    before(async () => {
        rouletteInstance = await Roulette.deployed();
    });

    it("should initialize the contract correctly", async () => {
        const owner = await rouletteInstance.owner();
        assert.equal(owner, accounts[0], "Owner should be the account that deployed the contract");
    });

    it("should place a bet correctly", async () => {
        const betAmount = web3.utils.toWei("1", "ether");
        await rouletteInstance.placeBet({ from: accounts[1], value: betAmount });
        const betCount = await rouletteInstance.getBetCount();
        assert.equal(betCount.toNumber(), 1, "Bet count should be 1");

        const bet = await rouletteInstance.getBet(0);
        assert.equal(bet.player, accounts[1], "Bet player should be accounts[1]");
        assert.equal(bet.amount.toString(), betAmount, "Bet amount should be 1 ether");
    });

    it("should end the game and select a winner", async () => {
        // Place another bet
        const betAmount = web3.utils.toWei("1", "ether");
        await rouletteInstance.placeBet({ from: accounts[2], value: betAmount });

        // End the game
        await rouletteInstance.endGame({ from: accounts[0] });

        const winner = await rouletteInstance.winner();
        const totalBetAmount = await rouletteInstance.totalBetAmount();
        const betCount = await rouletteInstance.getBetCount();

        assert(winner === accounts[1] || winner === accounts[2], "Winner should be one of the players");
        assert.equal(totalBetAmount.toNumber(), 0, "Total bet amount should be reset to 0");
        assert.equal(betCount.toNumber(), 0, "Bet count should be reset to 0");
    });

    it("should return the correct game state after ending the game", async () => {
        const gameState = await rouletteInstance.getGameState();
        const players = gameState[0];
        const totalBet = gameState[1];
        const winner = gameState[2];

        assert.equal(players.length, 0, "There should be no bets after the game ends");
        assert.equal(totalBet.toNumber(), 0, "Total bet amount should be 0 after the game ends");
        assert(winner === accounts[1] || winner === accounts[2], "Winner should be one of the players");
    });

});