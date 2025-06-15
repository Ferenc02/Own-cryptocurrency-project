import Block from "./Block.js";

export default class Blockchain {
  constructor() {
    this.chain = [];
    this.diffficulty = 2;
  }

  createGenesisBlock() {
    const genesis = new Block(
      0,
      new Date().toISOString(),
      {
        data: "Genesis Block",
      },
      "0"
    );
    genesis.mineBlock(this.diffficulty);
    this.chain.push(genesis);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.diffficulty);

    if (this.isValidNewBlock(newBlock, this.getLatestBlock())) {
      this.chain.push(newBlock);
    } else {
      throw new Error("Invalid block, cannot be added to the chain.");
    }
  }

  getBlock(index) {
    return this.chain[index];
  }

  isValidNewBlock(newBlock, previousBlock) {
    return (
      newBlock.previousHash === previousBlock.hash &&
      newBlock.hash === newBlock.calculateHash()
    );
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

  loadFromData(data) {
    this.chain = data.map((block) => Object.assign(new Block(), block));
  }
}
