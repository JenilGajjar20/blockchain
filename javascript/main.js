const SHA256 = require("crypto-js/sha256");
const readline = require("readline");

class Block {
  constructor(index, timestamp, data, previous_hash, difficulty) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previous_hash = previous_hash;
    this.difficulty = difficulty;
    this.nonce = 0;
    this.hash = this.computeHash();
  }

  computeHash() {
    // Concatenating block information and calculating SHA-256 hash
    return SHA256(
      this.index +
        this.timestamp +
        this.previous_hash +
        JSON.stringify(this.data) +
        this.nonce +
        this.difficulty
    ).toString();
  }

  mineNewBlock() {
    while (
      this.hash.substring(0, this.difficulty) !==
      Array(this.difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.computeHash();
    }
    console.log(`Block mined: ${this.hash}`);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2; // Set the initial difficulty level
  }

  createGenesisBlock() {
    // Creating the first block (genesis block)
    return new Block(0, new Date().getFullYear(), "Genesis Block", "0");
  }

  addBlock(data) {
    const newDate = new Date();
    // Adding a new block to the chain
    const index = this.chain.length;
    const previousHash = this.chain[index - 1].hash;
    const timestamp = new Date().getFullYear();
    const newBlock = new Block(
      index,
      timestamp,
      data,
      previousHash,
      this.difficulty
    );
    newBlock.mineNewBlock();
    this.chain.push(newBlock);
  }

  printBlockchain() {
    // Printing the information about each block in the blockchain
    this.chain.forEach((block) => {
      console.log(`Timestamp: ${block.timestamp}`);
      // console.log(`Data: ${block.data}`);
      console.log(`Previous Hash: ${block.previous_hash}`);
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
