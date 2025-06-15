import { log } from "console";
import crypto from "crypto";

export default class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(
        this.index +
          this.timestamp +
          JSON.stringify(this.data) +
          this.previousHash +
          this.nonce
      )
      .digest("hex");
  }

  mineBlock(difficulty = 4) {
    const target = Array(difficulty + 1).join("0");

    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
  static create(index, data, previousHash) {
    let block = new Block(index, new Date().toISOString(), data, previousHash);
    block.mineBlock(4);
    return block;
  }
}
