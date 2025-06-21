import Blockchain from "../models/Blockchain.js";
import Block from "../models/Block.js";
import { loadBlockchain, saveBlockchain } from "../database/blockchainDB.js";
import { logError } from "./logger.js";
import { generateKeyPairSync } from "crypto";

export let blockchain = null;

export async function initialize(PORT) {
  const data = await loadBlockchain(PORT);
  const masterData = await loadBlockchain();

  console.log("🚀 Initializing Blockchain... 🚀");

  blockchain = new Blockchain(PORT);

  blockchain.loadFromData(masterData);
  saveBlockchain(masterData, PORT);
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
    {
      transactions: data,
    },
    blockchain.getLatestBlock().hash ? blockchain.getLatestBlock().hash : "0"
  );
  blockchain.addBlock(newBlock);

  await saveBlockchain(blockchain.chain, blockchain.port);
  return newBlock;
}
export async function generateKeyAndAddress() {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 570,
    publicKeyEncoding: {
      type: "spki",
      format: "der",
    },
  });

  const address = publicKey.toString("hex").slice(20, 60);
  return { publicKey: publicKey.toString("hex"), privateKey, address };
}

export let getBalance = async (address) => {
  let balance = 0;

  const data = await loadBlockchain();
  if (!data || !Array.isArray(data)) return 0;

  for (const block of data) {
    if (block.data.transactions && Array.isArray(block.data.transactions)) {
      for (const tx of block.data.transactions) {
        if (tx.to === address) balance += tx.amount;
        if (tx.from === address) balance -= tx.amount;
      }
    }
  }

  return balance;
};

export let validateTransaction = (transaction) => {
  if (!transaction.from || !transaction.to || !transaction.amount) {
    return false;
  }

  if (transaction.amount <= 0) {
    return false;
  }

  if (transaction.from === transaction.to) {
    return false;
  }

  return true;
};
