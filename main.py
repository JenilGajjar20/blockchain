import hashlib
import datetime


class Block:
    def __init__(self, index, timestamp, data, previous_hash):
        self.index = index
        self.timestamp = timestamp
        self.data = data
        self.previous_hash = previous_hash
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        # Concatenating block information and calculating SHA-256 hash
        hash_data = str(self.index) + str(self.timestamp) + \
            str(self.data) + str(self.previous_hash)
        return hashlib.sha256(hash_data.encode()).hexdigest()


class Blockchain:
    def __init__(self):
        # Initializing the blockchain with the genesis block
        self.chain = [self.create_genesis_block()]

    def create_genesis_block(self):
        # Creating the first block (genesis block)
        return Block(0, datetime.datetime.now(), "Genesis Block", "0")

    def add_block(self, data):
        # Adding a nwe block to the chain
        index = len(self.chain)
        previous_hash = self.chain[-1].hash
        timestamp = datetime.datetime.now()
        new_block = Block(index, timestamp, data, previous_hash)
        self.chain.append(new_block)

    def print_blockchain(self):
        # Printing the information about each block in the blockchain
        for block in self.chain:
            print(f"Index: {block.index}")
            print(f"Timestamp: {block.timestamp}")
            print(f"Data: {block.data}")
            print(f"Previous Hash: {block.previous_hash}")
            print(f"Hash: {block.hash}")
            print("\n")


if __name__ == "__main__":
    try:
        num_blocks = int(
            input("Enter the number of blocks in the blockchain: "))
    except ValueError:
        print("Invalid input. Please enter a valid number.")
        exit()

    blockchain = Blockchain()

    # Subtract 1 for the genesis block
    for i in range(num_blocks - 1):
        data = input(f"Enter data for block {i + 1}: ")
        blockchain.add_block(data)

    blockchain.print_blockchain()
