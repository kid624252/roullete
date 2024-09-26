import Web3 from 'web3';

// const web3 = new Web3(Web3.givenProvider);
let web3
// export const connectWallet = async () => {
//     try {
//         const accounts = await web3.eth.requestAccounts();
//         // const accounts = await ethereum.send('eth_requestAccounts');
//         return accounts[0];
//     } catch (error) {
//         console.error("Wallet connection failed", error);
//     }
// };


export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const web3 = new Web3(window.ethereum);
            console.log("Connected to MetaMask");
            // You can add additional logic here, such as getting the user's balance
            // return the account so as to enable `setAccount(account);` in the App.js file
            const accounts = await web3.eth.getAccounts();
            return accounts[0];

        } catch (error) {
            console.error("User denied account access", error);
        }
    } else {
        console.error("MetaMask is not installed!");
    }
};

// export const placeBet = async (amount, contractAddress) => {
//     // Function to place a bet via the smart contract
// };




// ABI and contract address for the deployed casino smart contract
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "BetPlaced",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "winner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "GameFinished",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "bets",
		"outputs": [
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "bettingEndTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endGame",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "gameFinished",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getBet",
		"outputs": [
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBetCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getGameState",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "player",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					}
				],
				"internalType": "struct Roulette.Bet[]",
				"name": "players",
				"type": "tuple[]"
			},
			{
				"internalType": "uint256",
				"name": "totalBet",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "Winner",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "placeBet",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalBetAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "winner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddress = '0xcB4aE498243235d08B19EF0773942145e67C89CD';

// Initialize Web3
let casinoContract;
let accountaddress;

if (window.ethereum) {
    // Modern dApp browsers with MetaMask installed
    web3 = new Web3(window.ethereum);
    console.log('MetaMask detected!');

    // Instantiate the contract
    casinoContract = new web3.eth.Contract(contractABI, contractAddress);
} else {
    console.warn('MetaMask not detected. Please install MetaMask or use a web3-enabled browser.');
    web3 = null;
}

// // Function to connect to the user's MetaMask wallet
// export const connectWallet = async () => {
//     if (!web3) {
//         alert('Web3 is not initialized. Please install MetaMask!');
//         return;
//     }

//     try {
//         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//         selectedAccount = accounts[0];
//         console.log('Connected account:', selectedAccount);
//         return selectedAccount;
//     } catch (error) {
//         console.error('Error connecting wallet:', error);
//     }
// };

// Function to place a bet
export const placeBet = async (amount, accountaddress) => {
    // try {
    //     web3 = new Web3(window.ethereum);
    //     casinoContract = new web3.eth.Contract(contractABI, contractAddress);
    // } catch (error) {
    //     console.error('Error initializing contract:', error);
    // }

    if (!web3 || !accountaddress || !casinoContract) {
        console.error('Web3, account, or contract not initialized.');
        return;
    }

    try {
        // Sending a transaction to the placeBet function of the contract
        const receipt = await casinoContract.methods.placeBet().send({
            from: accountaddress,
            value: web3.utils.toWei(amount.toString(), 'ether')  // Convert bet amount to Wei
        });

        console.log('Bet placed successfully:', receipt);
        return receipt;
    } catch (error) {
        console.error('Error placing bet:', error);
    }
};

// Function to get the current game state
export const getGameState = async () => {
    if (!casinoContract) {
        console.error('Contract not initialized.');
        return;
    }

    try {
        const gameState = await casinoContract.methods.getGameState().call();
        console.log('Current game state:', gameState);
        return gameState;
    } catch (error) {
        console.error('Error fetching game state:', error);
    }
};

// Function to get the user's balance
export const getUserBalance = async (address) => {
    if (!web3) {
        console.error('Web3 not initialized.');
        return;
    }

    try {
        const balance = await web3.eth.getBalance(address);
        return web3.utils.fromWei(balance, 'ether');  // Convert balance to Ether
    } catch (error) {
        console.error('Error fetching user balance:', error);
    }
};

// Listen for account changes in MetaMask
export const listenForAccountChanges = (callback) => {
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            accountaddress = accounts[0];
            callback(accountaddress);
            console.log('Account changed:', accountaddress);
        });
    }
};

// Listen for contract events (e.g., BetPlaced)
export const listenForBetPlacedEvent = (callback) => {
    if (!casinoContract) {
        console.error('Contract not initialized.');
        return;
    }

    casinoContract.events.BetPlaced({
        filter: {}, // You can add filter options if needed
        fromBlock: 'latest'  // Start listening from the latest block
    })
        .on('data', (event) => {
            console.log('BetPlaced event detected:', event);
            callback(event);
        })
        .on('error', (error) => {
            console.error('Error listening for BetPlaced event:', error);
        });
};
