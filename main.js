
const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;

    }
}

class Block{

constructor(timestamp, transactions, previousHash = ''){
    
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash
    this.hash = this.calculateHash();
    this.nonce = 0;

}

calculateHash(){
    return SHA256(this.index + this.timestamp + JSON.stringify(this.data)  + this.nonce ).toString();
}
mineBlock(difficulty){
   
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
        this.nonce ++;
        this.hash = this.calculateHash();
    }
    console.log(`block mined ${this.hash}`)
}

}

class BlockChain{

    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 0;
        this.pendingTransactions = [];
        this.miningReward = 100;

    }

    createGenesisBlock(){
        return new Block('01/01/2019', "Genesis Block", "0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1]
    }

    minePendingTransactions(miningRewardAddress){
       let block = new Block(Date.now(), this.pendingTransactions);
       block.mineBlock(this.difficulty);
       console.log(`Block was mined ...`)
       this.chain.push(block);
       this.pendingTransactions = [
           new Transaction(null, miningRewardAddress, this.miningReward)

       ]
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);

    }

    getBalanceOfAddress(address){
        let balance = 0;
        for(let block of this.chain){
            for(let trans of block.transactions){
               if(trans.fromAddress == address){
                balance -= trans.amount;

               }
                
               if(trans.toAddress == address){
                   balance += trans.amount

               }
            }

        }

        return balance;

    }

    isChainValid(){
        for(let  i = 1; i < this.chain.length; i++){
            let currentBlock = this.chain[i];
            let previousBlock = this.chain[ i -1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }

        }

        return true
    }

}


let coin = new BlockChain();
coin.createTransaction(new Transaction('address1', 'address2', 1000));
coin.createTransaction(new Transaction('address2', 'address1', 460))

console.log('Starting the mine .... ')
coin.minePendingTransactions('foobar-address');

console.log(`Balance of foobar is ... ${coin.getBalanceOfAddress('address1')}`);
