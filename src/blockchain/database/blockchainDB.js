import fs from "fs/promises";
import { logError } from "../services/logger.js";

const dbFilePath = "./src/blockchain/database/blockchain.json";

export async function saveBlockchain(data) {
  try {
    await fs.writeFile(dbFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    logError(error);
  }
}

export async function loadBlockchain() {
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
