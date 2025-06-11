import { initializeP2PServer } from "./src/node/p2p.mjs";
import { connectToPeers } from "./src/node/p2p.mjs";

const HTTP_PORT = process.argv[2] || 3001;
const P2P_PORT = process.argv[3] || 6001;
const PEERS = process.argv.slice(4); // all remaining arguments

console.log(`HTTP_PORT: ${HTTP_PORT}`);
console.log(`P2P_PORT: ${P2P_PORT}`);
console.log(`PEERS: ${PEERS} \n`);

initializeP2PServer(P2P_PORT);
connectToPeers(PEERS);
