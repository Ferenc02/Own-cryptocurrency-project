import WebSocket, { WebSocketServer } from "ws";
import {
  generateKeyAndAddress,
  initialize,
} from "../blockchain/services/blockchainService.js";
import { getBalance } from "../blockchain/services/blockchainService.js";
import { saveBlockchain } from "../blockchain/database/blockchainDB.js";
import { createBlock } from "../blockchain/services/blockchainService.js";

import dotenv from "dotenv";
dotenv.config();

const masterServer = `${process.env.NODE_MASTER_SERVER_URL}`; // Master server address
const masterPort = process.env.NODE_MASTER_SERVER_PORT; // Master server port
const peers = [];

const startMasterServer = async () => {
  await initialize();
  const wss = new WebSocketServer({
    port: masterPort,
    host: masterServer,
  });

  console.log(
    `🌐 Master Server running on ws://${masterServer}:${masterPort} 🌐`
  );

  wss.on("connection", (ws) => {
    let firstBlockchainUpdate = false;
    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message);

        // If node registers itself as a peer
        if (data.type === "register") {
          console.log("🔗 New node connected to master ");

          let newAddress = await generateKeyAndAddress();
          let nodeAddress = newAddress.address;
          peers.push({
            address: data.address,
            port: data.port,
            ws: ws,
            nodeAddress: nodeAddress,
            balance: 0,
          });

          sendPeersList();
        } else if (data.type === "requestPeersList") {
          sendPeersList(data.device === "web-client" ? true : false, ws);
        } else if (data.type === "blockchainUpdate") {
          firstBlockchainUpdate = true;
          console.log("🔗 Blockchain update received from node", data.address);

          await saveBlockchain(data.blockchain);

          sendBlockchainUpdateToPeers(data.blockchain);
        } else {
          console.log("🔗 New connection connected to master ");
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    ws.on("close", () => {
      console.log("❌ Node disconnected from master");
      const index = peers.findIndex((peer) => peer.ws === ws);
      if (index !== -1) {
        peers.splice(index, 1);
      }

      sendPeersList();
    });
  });
};

let sendPeersList = async (deviceIsWeb, ws) => {
  console.log(
    "📡 Sending peers list to all connected nodes... " + peers.length
  );

  let peersBalances = await Promise.all(
    peers.map(async (peer) => {
      const balance = await getBalance(peer.nodeAddress);
      return {
        address: peer.address,
        port: peer.port,
        id: `${peer.address}:${peer.port}`,
        ws:
          peer.ws.readyState === WebSocket.OPEN ? "connected" : "disconnected",
        nodeAddress: peer.nodeAddress,
        balance: balance,
      };
    })
  );

  const peersList = JSON.stringify({
    type: "welcome",
    message: "🥰 Welcome to the master server! 🥰",
    peers: peersBalances,
  });

  if (deviceIsWeb) {
    ws.send(peersList);
  } else {
    peers.forEach((peer) => {
      if (peer.ws.readyState === WebSocket.OPEN) {
        peer.ws.send(peersList);
      }
    });
  }
};

let sendBlockchainUpdateToPeers = (blockchain) => {
  console.log("📦 Sending blockchain update to all connected nodes...");

  const blockchainUpdate = JSON.stringify({
    type: "blockchainUpdate",
    message: "📦 Blockchain data updated 📦",
    blockchain: blockchain,
  });

  peers.forEach((peer) => {
    if (peer.ws.readyState === WebSocket.OPEN) {
      peer.ws.send(blockchainUpdate);
    }
  });

  sendPeersList();
};

export default startMasterServer;
