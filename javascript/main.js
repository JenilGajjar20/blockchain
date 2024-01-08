const SHA256 = require("crypto-js/sha256");
const readline = require("readline");

class Block {
  constructor(index, timestamp, data, previous_hash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previous_hash = previous_hash;
    this.hash = this.computeHash();
  }

  computeHash() {
    // Concatenating block information and calculating SHA-256 hash
    return SHA256(
      this.index + this.timestamp,
      this.previous_hash,
      JSON.stringify(this.data).toString()
    );
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    // Creating the first block (genesis block)
    return new Block(0, new Date().toISOString(), "Genesis Block", "0");
  }

  addBlock(data) {
    // Adding a new block to the chain
    const index = this.chain.length;
    const previousHash = this.chain[index - 1].hash;
    const timestamp = new Date().toISOString();
    const newBlock = new Block(index, timestamp, data, previousHash);
    this.chain.push({ data: newBlock });
  }

  printBlockchain() {
    // Printing the information about each block in the blockchain
    this.chain.forEach((block) => {
      console.log(`Index: ${block.index}`);
      console.log(`Timestamp: ${block.timestamp}`);
      console.log(`Data: ${block.data}`);
      console.log(`Previous Hash: ${block.previousHash}`);
      console.log(`Hash: ${block.hash}\n`);
    });
  }
}

const blockchain = new Blockchain();
const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

r1.question("Enter the number of blocks in the blockchain: ", (numBlocks) => {
  numBlocks = parseInt(numBlocks);

  const addBlocks = (i) => {
    if (i < numBlocks) {
      r1.question(`Enter data for block ${i + 1}: `, (data) => {
        blockchain.addBlock(data);
        addBlocks(i + 1);
      });
    } else {
      r1.close();
      console.log("\nBlockchain: \n");
      blockchain.printBlockchain();
    }
  };

  addBlocks(0);
});
