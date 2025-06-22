/**
 * Utility to grab the local IPv4 address and save it to a .env file.
 * Used for configuring the master server URL in a local environment.
 */

import os from "os";
import fs from "fs";
const getLocalIP = () => {
  const ipAddresses = [];
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    for (const iface of interfaces[interfaceName]) {
      // This should filter out all virtual interfaces and just return the most common local IPs.
      if (iface.family === "IPv4" && !iface.internal) {
        if (
          iface.address.startsWith("192.168.") ||
          iface.address.startsWith("10.")
        ) {
          ipAddresses.push(iface.address);
        }
      }
    }
  }

  if (ipAddresses.length > 0) {
    return ipAddresses[0]; // Should be good to return the first local IP found
  }

  return null;
};
export const saveIPToEnv = () => {
  const envPath = "./.env";
  const localIP = getLocalIP();
  if (localIP) {
    const envContent = `NODE_MASTER_SERVER_URL=${localIP}\nNODE_MASTER_SERVER_PORT=8080\nJWT_SECRET=424c6e997f3a21017769f113168b672af39323fe3688c9982a42e7c255965edd`;
    fs.writeFileSync(envPath, envContent, { flag: "w" });
    console.log(`Local IP saved to ${envPath}`);
    process.exit(0);
  } else {
    console.error("No local IP found to save.");
  }
};

export default getLocalIP;
