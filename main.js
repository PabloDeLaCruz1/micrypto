const SHA256 = require('crypto-js/sha256');

class Block{
    //index is optional, data to store details, previoushash ensures blockchain integrity
    constructor(index, timestamp, data, previoushash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previoushash = previoushash;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index + this.previoushash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2017", "Genesis Block", "NA")
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }

    addBlock(newBlock){
        newBlock.previoushash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock); //in reality you cant add a new block like this, but this works for demonstration
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previoushash = this.chain [i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previoushash !== previoushash.hash){
                return false;
            }

            return true;
        }
    }

}

let miCoin = new blockchain();
miCoin.addBlock(new Block(1, "09/22/1988", { amount: 2}));
miCoin.addBlock(new Block(2, "09/24/1988", { amount: 11}));
// console.log(JSON.stringify(miCoin, null, 4));

console.log('valid?', miCoin.isChainValid());
miCoin.chain[1].data = { amount: 19999}
miCoin.chain[1].hash = miCoin.chain[1].calculateHash();
console.log('valid?', miCoin.isChainValid());