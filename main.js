const SHA256 = require('crypto-js/sha256');

class Block {
    //index is optional, data to store details, previousHash ensures blockchain integrity
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; 
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    //To prevent someone from changing all our hashes and passing our isChainValid test, we need proof of work:
    //Proof you put a lot of work into creating a block. Google blockchain proof of work to understand.  
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block Mined: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2017", "Genesis Block", "NA")
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        // newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty)
        this.chain.push(newBlock); //In reality you cant add a new block like this, but this works for demonstration
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}
//Create blocks, test if valid
let miCoin = new Blockchain();
console.log("mining 1");
miCoin.addBlock(new Block(1, "09/22/1988", {
    amount: 2
}));
console.log("mining 1");
miCoin.addBlock(new Block(2, "09/24/1988", {
    amount: 11
}));
// console.log(JSON.stringify(miCoin, null, 4));

// console.log('valid?', miCoin.isChainValid());
// miCoin.chain[1].data = {
//     amount: 19999
// }
// miCoin.chain[1].hash = miCoin.chain[1].calculateHash();
// console.log('valid?', miCoin.isChainValid());

// console.log(JSON.stringify(miCoin, null, 4));

