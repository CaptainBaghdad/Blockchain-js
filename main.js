const {BlockChain,Transaction} = require('./blockchain')

let EC = require('elliptic').ec;

let ec= new EC('secp256k1');

let myKey = ec.keyFromPrivate('7887c1ccfcbbf81ed9470143cf2beb69e56ee19575aaacb5c50ae022886f985f')
let myWalletAddress = myKey.getPublic('hex')



let coin = new BlockChain();

let trans1 = new Transaction(myWalletAddress, 'public Key goes here', 300);
trans1.signTransaction(myKey);
coin.addTransaction(trans1);


console.log('Starting the mine .... ')
coin.minePendingTransactions(myWalletAddress);

console.log(`Balance of foobar is ... ${coin.getBalanceOfAddress(myWalletAddress)}`);
