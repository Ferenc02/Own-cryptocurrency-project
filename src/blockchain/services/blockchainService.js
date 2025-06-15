import Blockchain from "../models/Blockchain.js";
import Block from "../models/Block.js";
import { loadBlockchain, saveBlockchain } from "../database/blockchainDB.js";
import { logError } from "./logger.js";

let blockchain = null;

export async function initialize(PORT) {
  const data = await loadBlockchain(PORT);
  console.log("🚀 Initializing Blockchain... 🚀");

  blockchain = new Blockchain();
  if (data) {
    blockchain.loadFromData(data);
  } else {
    console.log(
      "🚀 No existing blockchain data found, creating genesis block.🚀 \n"
    );
    blockchain.createGenesisBlock();
    await saveBlockchain(blockchain.chain, PORT);
  }
}

export function getAllBlocks() {
  return blockchain.chain;
}

export function getBlock(index) {
  return blockchain.chain[index];
}

export async function createBlock(data) {
  const newBlock = Block.create(
    blockchain.chain.length,
    data,
    blockchain.getLatestBlock().hash ? blockchain.getLatestBlock().hash : "0"
  );
  blockchain.addBlock(newBlock);
  await saveBlockchain(blockchain.chain);
  return newBlock;
}
