
const SHA256 = require('crypto-js/sha256')

class Block{

constructor(index, timestamp, data, previousHash = ''){
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
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
        this.difficulty = 4;

    }

    createGenesisBlock(){
        return new Block(0, '01/01/2019', "Genesis Block", "0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1]
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty)
        this.chain.push(newBlock);
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
console.log(`Mining block ...`)
coin.addBlock(new Block(1, "09/23/19", {amount: 100}));

console.log(`Mining block 2 ..... `)
coin.addBlock(new Block(2, "09/22/19", {amount: 50}));
//coin.chain[1].data = {amount: 5000}
