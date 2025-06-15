import { describe, it, expect, beforeEach } from "vitest";

import Block from "../models/Block.js";
import Blockchain from "../models/Blockchain.js";
import { loadBlockchain, saveBlockchain } from "../database/blockchainDB.js";

describe("Block tests", () => {
  it("should create a new genesis block with correct properties", () => {
    const block = Block.create(0, { data: "Genesis Block" }, "0");
    expect(block.index).toBe(0);
    expect(block.data).toEqual({ data: "Genesis Block" });
    expect(block.previousHash).toBe("0");
    expect(block.hash).toMatch(/^0000/); // This is with difficulty 4
  });

  it("should calculate hash correctly", () => {
    const block = new Block(
      1,
      new Date().toISOString(),
      { data: "Test Block" },
      "0"
    );
    const hash = block.hash;
    expect(hash).toBe(block.calculateHash());
  });

  it("should mine a block with correct difficulty", () => {
    const block = Block.create(1, { data: "Test Block" }, "0");
    expect(block.hash.substring(0, 4)).toBe("0000"); // Same here as above
  });

  it("should be valid after mining", () => {
    const block = Block.create(1, { data: "Test Block" }, "0");
    expect(block.hash).toMatch(/^0000/);
    expect(block.nonce).toBeGreaterThan(0);
  });
  it("should not have the same hash for different blocks", () => {
    const block1 = Block.create(1, { data: "Block 1" }, "0");
    const block2 = Block.create(2, { data: "Block 2" }, block1.hash);
    expect(block1.hash).not.toBe(block2.hash);
  });
});

describe("Blockchain tests", () => {
  let blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
    blockchain.createGenesisBlock();
  });

  it("should create a genesis block", () => {
    expect(blockchain.chain.length).toBe(1);
    expect(blockchain.chain[0].index).toBe(0);
    expect(blockchain.chain[0].data).toEqual({ data: "Genesis Block" });
  });

  it("should add a new block to the chain", async () => {
    const newBlock = Block.create(
      1,
      { data: "New Block" },
      blockchain.getLatestBlock().hash
    );
    blockchain.addBlock(newBlock);
    expect(blockchain.chain.length).toBe(2);
    expect(blockchain.chain[1].data).toEqual({ data: "New Block" });
  });

  it("should save and load blockchain data", async () => {
    await saveBlockchain(blockchain.chain);
    const loadedData = await loadBlockchain();
    expect(loadedData.length).toBe(1);
    expect(loadedData[0].data).toEqual({ data: "Genesis Block" });
  });
});
