const SHA256 = require('crypto-js/sha256');
let EC = require('elliptic').ec;

let ec= new EC('secp256k1');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;

    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();

    }

    signTransaction(signKey){
        if(signKey.getPublic('hex') != this.fromAddress){
            throw new Error('You can not do that ...Why you trying to play me?')

        }
        let hashTrans = this.calculateHash();
        let sig = signKey.sign(hashTrans, 'base64');
        this.signature = sig.toDER('hex');

    }

    isValid(){
        if(this.fromAddress == null){
            return true;

        }

        if(!this.signature || this.signature.length == 0){
            throw new Error('Ther is no signature for this trans')
        }

        let publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
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

hasValidTransactions(){
    for(let tx of this.transactions){
        if(tx.isValid()){
            return false;

        }

    }
        return true;
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

    addTransaction(transaction){
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('You have to fill in the correct info');
        }

        if(!transaction.isValid()){
            throw new Error('Mofo you can\'t do that');

        }
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

            if(!currentBlock.hasValidTransactions()){
                return false;
            }

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

module.exports.BlockChain = BlockChain;
module.exports.Transaction = Transaction;