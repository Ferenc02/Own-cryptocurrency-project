import dotenv from "dotenv";
dotenv.config();
import startMasterServer from "./src/node/master-server.js";
import initializeP2PServer from "./src/node/p2p.js";
import getLocalIP, { saveIPToEnv } from "./src/misc/ipGrabber.mjs";
import express from "express";
import { initialize } from "./src/blockchain/services/blockchainService.js";
import errorHandler from "./src/blockchain/middlewares/errorHandler.js";
import router from "./src/blockchain/routes/blockRoutes.js";
import userRoutes from "./src/backend/routes/userRoutes.js";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { xss } from "express-xss-sanitizer";
import mongoSanitize from "express-mongo-sanitize";

import connectDb from "./src/backend/database/db.js";

// Rate limiting to prevent ddos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: "Why so many requests? Please slow down.",
});

// Command line arguments to start different servers
const args = process.argv.slice(2);

// Start the master server if --master flag is provided
if (args.includes("--master")) {
  startMasterServer();
}

// Start the P2P server if --node flag is provided
if (args.includes("--node")) {
  let randomPort = Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024;
  let localIP = getLocalIP();
  initializeP2PServer(randomPort);

  const app = express();
  app.use(cors());
  app.use(xss());
  app.use(limiter);
  app.use(express.json());

  await initialize(randomPort);

  app.use("/api/blocks", router);

  app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
  });

  app.use(errorHandler);

  app.listen(randomPort + 1, () => {
    console.log(
      `Express server running on  http://${localIP + ":" + (randomPort + 1)}`
    );
  });
}

// Save the IP address to .env file if --ip flag is provided
if (args.includes("--ip")) {
  saveIPToEnv();
}

// Start the backend server if --backend flag is provided
if (args.includes("--backend")) {
  connectDb();

  const app = express();
  app.use(cors());
  app.use(xss());
  app.use(limiter);
  app.use(express.json());
  app.use("/api", userRoutes);

  app.listen(6200, () => {
    console.log("🚀 Backend server running on  http://localhost:6200 🚀");
  });

  app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the backend server" });
  });
}

// Start the web server if --web flag is provided
if (args.includes("--web")) {
  const app = express();

  app.use(cors());
  app.use(xss());
  app.use(limiter);
  app.use(express.static("src/public"));

  app.get("/env", (req, res) => {
    res.status(200).json({
      NODE_MASTER_SERVER_URL: process.env.NODE_MASTER_SERVER_URL,
      NODE_MASTER_SERVER_PORT: process.env.NODE_MASTER_SERVER_PORT,
    });
  });
  app.listen(6201, () => {
    console.log("🚀 Web server running on http://localhost:6201 🚀");
  });
}
if (args.includes("--help")) {
  console.log(
    "Available commands:\n" +
      "--master: Start the master server\n" +
      "--node: Start the P2P node server\n" +
      "--ip: Save the IP address to .env file\n" +
      "--backend: Start the backend server\n" +
      "--web: Start the web server\n" +
      "--help: Show this help message"
  );
}
