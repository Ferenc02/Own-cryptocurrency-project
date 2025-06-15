import dotenv from "dotenv";
dotenv.config();
import startMasterServer from "./src/node/master-server.js";
import initializeP2PServer from "./src/node/p2p.js";
import { saveIPToEnv } from "./src/misc/ipGrabber.mjs";
import express from "express";
import { initialize } from "./src/blockchain/services/blockchainService.js";
import errorHandler from "./src/blockchain/middlewares/errorHandler.js";
import router from "./src/blockchain/routes/blockRoutes.js";

const args = process.argv.slice(2);

if (args.includes("--master")) {
  startMasterServer();
}

if (args.includes("--node")) {
  let randomPort = Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024;
  initializeP2PServer(randomPort);

  const app = express();
  app.use(express.json());
  await initialize();

  app.use("/api/blocks", router);

  app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
  });

  app.use(errorHandler);

  app.listen(randomPort, () => {
    console.log(`Express server running on port ${randomPort}`);
  });
}

if (args.includes("--ip")) {
  saveIPToEnv();
}
