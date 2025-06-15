import WebSocket, { WebSocketServer } from "ws";

import dotenv from "dotenv";
dotenv.config();

const masterServer = `${process.env.NODE_MASTER_SERVER_URL}`; // Master server address
const masterPort = process.env.NODE_MASTER_SERVER_PORT; // Master server port
const peers = [];

const startMasterServer = () => {
  const wss = new WebSocketServer({
    port: masterPort,
    host: masterServer,
  });

  console.log(
    `🌐 Master Server running on ws://${masterServer}:${masterPort} 🌐`
  );

  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);

        // If node registers itself as a pper
        if (data.type === "register") {
          console.log("🔗 New node connected to master ");

          peers.push({
            address: data.address,
            port: data.port,
            ws: ws,
          });

          sendPeersList();
        } else if (data.type === "requestPeersList") {
          sendPeersList(data.device === "web-client" ? true : false, ws);
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

let sendPeersList = (deviceIsWeb, ws) => {
  console.log(
    "📡 Sending peers list to all connected nodes... " + peers.length
  );
  const peersList = JSON.stringify({
    type: "welcome",
    message: "🥰 Welcome to the master server! 🥰",
    peers: peers.map((peer) => ({
      address: peer.address,
      port: peer.port,
      id: `${peer.address}:${peer.port}`,
      ws: peer.ws.readyState === WebSocket.OPEN ? "connected" : "disconnected",
    })),
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

export default startMasterServer;
