import fs from "fs/promises";
import mongoose from "mongoose";
import { logError } from "../services/logger.js";

const mongooseURI = "mongodb://127.0.0.1:27017/db";

export const getBlockchainFromMongo = async () => {
  try {
    const conn = await mongoose.connect(mongooseURI);

    if (conn) {
      return conn
        .getCollection("blockchain")
        .findOne({})
        .then((data) => {
          if (data) {
            return data.blockchain;
          } else {
            return null;
          }
        });
    }
  } catch (error) {
    console.error(error);
  }
};

export const saveBlockchainToMongo = async (data) => {
  try {
    const conn = await mongoose.connect(mongooseURI);

    if (conn) {
      const db = mongoose.connection.db;
      const collection = db.collection("blockchain");
      // Upsert the blockchain data (replace or insert)
      await collection.updateOne(
        {},
        { $set: { blockchain: data } },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error(error);
  }
};

export async function saveBlockchain(data, PORT) {
  let dbFilePath;

  if (PORT) {
    dbFilePath = `./src/blockchain/database/${PORT}/blockchain.json`;
    fs.mkdir(`./src/blockchain/database/${PORT}`, { recursive: true }).catch(
      (error) => logError(error)
    );
  } else {
    dbFilePath = `./src/blockchain/database/blockchain.json`;
  }

  try {
    await fs.writeFile(dbFilePath, JSON.stringify(data, null, 2));
    await saveBlockchainToMongo(data);
  } catch (error) {
    logError(error);
  }
}

export async function loadBlockchain(PORT) {
  let dbFilePath;
  if (PORT) {
    dbFilePath = `./src/blockchain/database/${PORT}/blockchain.json`;
  } else {
    dbFilePath = `./src/blockchain/database/blockchain.json`;
  }

  // Check if the file exists before trying to read it
  try {
    await fs.access(dbFilePath);
  } catch (error) {
    // If the file does not exist, return null
    if (error.code === "ENOENT") {
      return null;
    }
    logError(error);
    return null;
  }
  try {
    const data = await fs.readFile(dbFilePath, "utf-8");
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  } catch (error) {
    logError(error);
    return null;
  }
}
