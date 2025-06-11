import dotenv from "dotenv";
dotenv.config();
import WebSocket, { WebSocketServer } from "ws";
const masterServer = `${process.env.NODE_MASTER_SERVER_URL}`;

const initializeP2PServer = (port) => {
  const server = new WebSocketServer({ port });
  console.log(`🌐 P2P server is running on port ${port} 🌐`);
  server.on("connection", (ws) => {
    console.log("✅ New peer connected");
  });

  registerWithMasterServer();
};

const registerWithMasterServer = () => {
  const ws = new WebSocket(masterServer);

  ws.on("open", () => {
    console.log("🔗 Connected to master server");

    ws.send(
      JSON.stringify({
        type: "register",
        message: "🥰 Node is registering with the master server 🥰",
        address: "192.168.1.50",
        port: "6000",
      })
    );
  });
  ws.on("error", (error) => {
    console.error("❌ Error connecting to master server:", error);
  });
};

export default initializeP2PServer;
