import WebSocket, { WebSocketServer } from "ws";

let sockets = [];

const initializeP2PServer = (port) => {
  const server = new WebSocketServer({ port });
  console.log(`🌐 P2P server is running on port ${port} 🌐`);
  server.on("connection", (ws) => {
    console.log("✅ New peer connected");
    initializeConnection(ws);
  });
};

const initializeConnection = (ws) => {
  sockets.push(ws);
  console.log(
    `🚀 New connection established. Total connections: ${sockets.length} 🚀`
  );

  ws.on("message", (data) => {
    console.log(`Received message: ${data}`);
    broadcast(message);
  });
  ws.on("close", () => {
    sockets = sockets.filter((socket) => socket !== ws);
    console.log(
      `❌ Connection closed. Total connections: ${sockets.length} ❌`
    );
  });
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
};

const connectToPeers = (peers) => {
  peers.forEach((peer) => {
    const ws = new WebSocket(peer);

    ws.on("open", () => {
      console.log(`Connected to peer: ${peer}`);
      initializeConnection(ws);
    });

    ws.on("error", (error) => {
      console.error(`Connection error with peer ${peer}:`, error);
    });
  });
};

const broadcast = (data) => {
  sockets.forEach((socket) => {
    socket.send(data);
  });
};

export { initializeP2PServer, connectToPeers, broadcast, sockets };
