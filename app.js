import dotenv from "dotenv";
dotenv.config();
import startMasterServer from "./src/node/master-server.js";
import initializeP2PServer from "./src/node/p2p.js";
const args = process.argv.slice(2);

if (args.includes("--master")) {
  startMasterServer();
}

if (args.includes("--node")) {
  initializeP2PServer(6000);
}
