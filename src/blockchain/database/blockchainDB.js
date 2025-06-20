import fs from "fs/promises";
import { logError } from "../services/logger.js";

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
