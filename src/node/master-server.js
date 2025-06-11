import WebSocket, { WebSocketServer } from "ws";

import dotenv from "dotenv";
dotenv.config();

const masterServer = `${process.env.NODE_MASTER_SERVER_URL}`; // Master server address
const peers = [];

const wss = new WebSocketServer(
  masterServer ? { port: 8080 } : { noServer: true }
);

const startMasterServer = () => {
  console.log(`🌐 Master Server running on ${masterServer} 🌐`);

  wss.on("connection", (ws) => {
    console.log("🔗 New node connected to master ");

    ws.on("message", (message) => {
      if (typeof message === "string") {
        try {
          const data = JSON.parse(message);
          if (data.type === "register") {
            console.log("Node registered:", data.message);
            peers.push(ws);
          } else {
            console.log("Received message:", data);
          }
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      }
    });

    ws.send(
      JSON.stringify({
        type: "welcome",
        message: "🥰 Welcome to the master server! 🥰",
        peers: peers.map((peer) => ({
          address: peer.address,
          port: peer.port,
        })),
      })
    );
    ws.on("close", () => {
      console.log("❌ Node disconnected from master");
      const index = peers.indexOf(ws);
      if (index !== -1) {
        peers.splice(index, 1);
      }
    });
  });
};

export default startMasterServer;
