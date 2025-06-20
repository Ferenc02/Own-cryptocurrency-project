import { generateKeyAndAddress } from "./src/blockchain/services/blockchainService.js";

const { publicKey, privateKey, address } = await generateKeyAndAddress();

console.log("Public Key:", publicKey);
console.log("Private Key:", privateKey);
console.log("Address:", address);
