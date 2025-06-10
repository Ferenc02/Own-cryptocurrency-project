import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let nodeCount = 0;

wss.on("connection", (ws) => {
  nodeCount++;
  console.log(`Node count: ${nodeCount}`);

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    // Echo the message back to the client
    ws.send(`Server received: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    nodeCount--;
  });

  ws.send("Welcome to awesome WebSocket server!");
});
console.log("🚀 WebSocket server is running on ws://localhost:8080 🚀");
