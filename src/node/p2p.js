import dotenv from "dotenv";
dotenv.config();
import WebSocket, { WebSocketServer } from "ws";
import getLocalIP from "../misc/ipGrabber.mjs";
import {
  blockchain,
  createBlock,
  getBalance,
} from "../blockchain/services/blockchainService.js";
import { saveBlockchain } from "../blockchain/database/blockchainDB.js";

let server;
let localIP;
let localPort;
let ws;
const masterServer = `ws://${process.env.NODE_MASTER_SERVER_URL}:${process.env.NODE_MASTER_SERVER_PORT}`; // Master server address
let nodeAddress;
let transactionPool = [];

const initializeP2PServer = (port) => {
  if (!port) {
    console.error("❌ Port is required to initialize the P2P server");
    return;
  }

  localIP = getLocalIP();
  localPort = port;

  server = new WebSocketServer({
    port: localPort,
    host: localIP,
  });

  server.on("listening", () => {
    console.log(`🌐 P2P server is running on port ${port} 🌐`);
    registerWithMasterServer();
  });

  server.on("connection", (ws) => {
    console.log("✅ New peer connected");

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message);
        if (data.type === "mineBlock") {
          let startTimer = Date.now();

          let transactionReward = {
            type: "transactionReward",
            from: "0",
            to: nodeAddress,
            amount: 20,
          };

          transactionPool.push(transactionReward);

          transactionPool = transactionPool.map((tx) => {
            if (tx.state === "pending") {
              return { ...tx, state: "done" };
            }
            return tx;
          });

          createBlock(transactionPool);

          let endTimer = Date.now();
          let timeElapsed = endTimer - startTimer;

          console.log(
            `⛏️ Block #${
              blockchain.chain.length - 1
            } created in ${timeElapsed}ms`
          );

          sendBlockchainToMaster(timeElapsed);
        } else if (data.type === "getBalance") {
          const address = data.address;
          const balance = await getBalance(address);
          const balanceFromPool = transactionPool.reduce((acc, tx) => {
            if (tx.to === address) acc += tx.amount;
            if (tx.from === address) acc -= tx.amount;
            return acc;
          }, 0);

          // console.log(`Balance for ${address}: ${balance + balanceFromPool}`);
          ws.send(
            JSON.stringify({
              type: "balanceResponse",
              address: address,
              balance: (balance + balanceFromPool).toFixed(2),
            })
          );
        } else if (data.type === "addTransaction") {
          const { from, to, amount, message } = data.transaction;
          if (from && to && amount > 0) {
            const transaction = {
              from: from,
              to: to,
              amount: amount,
              message: message || "No message provided",
              state: "pending",
            };
            transactionPool.push(transaction);
            console.log("Transaction added to the pool:", transaction);
          } else {
            console.error("Invalid transaction data:", data.transaction);
          }
        }
      } catch (error) {
        console.error("Error parsing message from peer:", error);
      }
    });
  });
};

const registerWithMasterServer = () => {
  ws = new WebSocket(masterServer);

  ws.on("open", () => {
    console.log("🔗 Connected to master server");
    ws.send(
      JSON.stringify({
        type: "register",
        message: "🥰 Node is registering with the master server 🥰",
        address: localIP,
        port: localPort,
      })
    );
  });

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === "welcome") {
        console.log(data.message);
        console.log("Connected peers:", data.peers);

        nodeAddress = data.peers.find(
          (peer) => peer.address === localIP && peer.port === localPort
        )?.nodeAddress;
      } else if (data.type === "blockchainUpdate") {
        console.log("📦 Blockchain update received from master server 📦");
        blockchain.chain = data.blockchain;
        saveBlockchain(data.blockchain, localPort);
      } else {
        console.log("Received message from  server:", data);
      }
    } catch (error) {
      console.error("Error parsing message from master server:", error);
    }
  });
  ws.on("error", (error) => {
    console.error("❌ Error connecting to master server:", error);
  });
};

export const requestPeersList = () => {
  ws.send(
    JSON.stringify({
      type: "requestPeersList",
    })
  );
};

export const sendBlockchainToMaster = (timeElapsed) => {
  ws.send(
    JSON.stringify({
      type: "blockchainUpdate",
      message: "📦 Sending blockchain data to master server 📦",
      blockchain: blockchain.chain,
      timeElapsed: timeElapsed,
      address: localIP,
      port: localPort,
    })
  );
  console.log("📦 Blockchain data sent to master server 📦");
};

export default initializeP2PServer;
