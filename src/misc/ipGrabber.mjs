import os from "os";
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

export default getLocalIP;
