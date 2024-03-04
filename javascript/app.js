const crypto = require("crypto");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class Transaction {
  constructor(sender, recipient, amount) {
    this.sender = sender;
    this.recipient = recipient;
    this.amount = amount;
  }
}

class Block {
  constructor(
    index,
    timestamp,
    transactions,
    previousHash,
    nonce = 0,
    reward = 10
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = nonce;
    this.reward = reward;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    const blockInfo =
      this.index +
      this.timestamp +
      JSON.stringify(this.transactions) +
      this.previousHash +
      this.nonce +
      this.reward;
    return crypto.createHash("sha256").update(blockInfo).digest("hex");
  }
}

function createGenesisBlock() {
  return new Block(0, Date.now(), [], "0", 0);
}

function createNewBlock(index, previousBlock, minerAddress = "") {
  const timestamp = Date.now();
  let transactions = [];
  return new Promise((resolve, reject) => {
    rl.question(
      `Enter the number of transactions for Block #${index}: `,
      (numTransactions) => {
        numTransactions = parseInt(numTransactions);
        const promptTransaction = (i) => {
          if (i === numTransactions) {
            const previousHash = previousBlock.hash;
            const newBlock = proofOfWork(
              new Block(index, timestamp, transactions, previousHash, 5),
              minerAddress
            );
            resolve(newBlock);
            return;
          }
          rl.question(`Enter sender for Transaction #${i + 1}: `, (sender) => {
            rl.question(
              `Enter recipient for Transaction #${i + 1}: `,
              (recipient) => {
                rl.question(
                  `Enter amount for Transaction #${i + 1}: `,
                  (amount) => {
                    transactions.push(
                      new Transaction(sender, recipient, parseFloat(amount))
                    );
                    promptTransaction(i + 1);
                  }
                );
              }
            );
          });
        };
        promptTransaction(0);
      }
    );
  });
}

function proofOfWork(block, minerAddress) {
  const difficulty = 2;
  while (block.hash.substring(0, difficulty) !== "0".repeat(difficulty)) {
    block.nonce++;
    block.hash = block.calculateHash();
  }
  console.log(
    `Block ${block.index} mined with nonce ${block.nonce}, hash ${
      block.hash
    }, timestamp ${formatTimestamp(block.timestamp)}`
  );
  console.log(`Reward for miner ${minerAddress}: ${block.reward} coins`);
  return block;
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toISOString().slice(0, 19).replace("T", " ");
}

async function main() {
  const genesisBlock = createGenesisBlock();
  let blockchain = [genesisBlock];

  const numBlocksToAdd = await new Promise((resolve, reject) => {
    rl.question("Enter the number of blocks to add: ", (num) => {
      resolve(parseInt(num));
    });
  });

  for (let i = 1; i <= numBlocksToAdd; i++) {
    const minerAddress = await new Promise((resolve, reject) => {
      rl.question(`Enter miner address for Block #${i}: `, (address) => {
        resolve(address);
      });
    });
    const newBlock = await createNewBlock(
      i,
      blockchain[blockchain.length - 1],
      minerAddress
    );
    blockchain.push(newBlock);
  }

  console.log("\nFinal Blockchain:");
  blockchain.forEach((block) => {
    console.log(`\nBlock #${block.index} details:`);
    console.log(`  - Timestamp: ${formatTimestamp(block.timestamp)}`);
    console.log("  - Transactions:");
    block.transactions.forEach((transaction) => {
      console.log(`      - Sender: ${transaction.sender}`);
      console.log(`      - Recipient: ${transaction.recipient}`);
      console.log(`      - Amount: ${transaction.amount}`);
    });
    console.log(`  - Previous Hash: ${block.previousHash}`);
    console.log(`  - New Hash: ${block.hash}`);
    console.log(`  - Reward: ${block.reward} coins`);
  });

  rl.close();
}

main();
