import dotenv from "dotenv";
dotenv.config();
import WebSocket, { WebSocketServer } from "ws";
import getLocalIP from "../misc/ipGrabber.mjs";

let server;
let localIP;
let localPort;
let ws;
const masterServer = `ws://${process.env.NODE_MASTER_SERVER_URL}:${process.env.NODE_MASTER_SERVER_PORT}`; // Master server address

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
      } else {
        console.log("Received message from master server:", data);
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

export default initializeP2PServer;
