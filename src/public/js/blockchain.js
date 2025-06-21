const availableDepositAmount = document.querySelector(
  ".available-deposit-amount"
);

const sendMineBlockRequest = () => {
  nodeList.forEach((node) => {
    if (node.ws === "connected") {
      let newSocket = new WebSocket(`ws://${node.address}:${node.port}`);

      newSocket.onopen = () => {
        newSocket.send(
          JSON.stringify({
            type: "mineBlock",
          })
        );
        // console.log("Request to mine block sent to node:", node);
      };
    }
  });
};
const getBalance = async (address) => {
  const node = selectRandomNode();

  if (!node) return 0;

  return new Promise((resolve, reject) => {
    const newSocket = new WebSocket(`ws://${node.address}:${node.port}`);

    newSocket.onopen = () => {
      newSocket.send(
        JSON.stringify({
          type: "getBalance",
          address: address,
        })
      );
    };

    newSocket.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.type === "balanceResponse") {
          // console.log(`Balance for ${address}:`, response.balance);
          resolve(response.balance);
        } else {
          console.error("Unexpected response:", response);
          reject("Unexpected response");
        }
      } catch (error) {
        reject(error);
      }
    };

    newSocket.onerror = (err) => {
      reject(err);
    };
  });
};

const addTransaction = (from, to, amount, message) => {
  if (from && to && amount > 0) {
    const transaction = {
      from: from,
      to: to,
      amount: amount,
      message: message || "No message provided",
    };
    sendTransactionToNodes(transaction);
  } else {
    console.error("Invalid transaction parameters.");
  }
};

const requestTransactionsFromNodes = async () => {
  let node = selectRandomNode();
  if (node.ws === "connected") {
    return new Promise((resolve, reject) => {
      let newSocket = new WebSocket(`ws://${node.address}:${node.port}`);

      newSocket.onopen = () => {
        newSocket.send(
          JSON.stringify({
            type: "requestTransactions",
          })
        );
      };

      newSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "transactions") {
            // console.log(
            //   "Received transaction pool from node:",
            //   data.transactions
            // );
            resolve(data.transactions);
          }
        } catch (error) {
          console.error("Error parsing message from node:", error);
          reject(error);
        }
      };

      newSocket.onerror = (err) => {
        console.error("Error requesting transactions from node:", err);
      };
    });
  }
};

const requestBlocksFromNodes = async () => {
  let node = selectRandomNode();
  if (node.ws === "connected") {
    return new Promise((resolve, reject) => {
      let newSocket = new WebSocket(`ws://${node.address}:${node.port}`);

      newSocket.onopen = () => {
        newSocket.send(
          JSON.stringify({
            type: "requestBlocks",
          })
        );
      };

      newSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "blockchain") {
            resolve(data.blockchain);
          }
        } catch (error) {
          console.error("Error parsing message from node:", error);
          reject(error);
        }
      };

      newSocket.onerror = (err) => {
        console.error("Error requesting blocks from node:", err);
      };
    });
  }
};

const sendTransactionToNodes = (transaction) => {
  if (
    !transaction ||
    !transaction.from ||
    !transaction.to ||
    !transaction.amount
  ) {
    console.error("Invalid transaction, cannot be sent to nodes.");
    return;
  }

  nodeList.forEach((node) => {
    if (node.ws === "connected") {
      let newSocket = new WebSocket(`ws://${node.address}:${node.port}`);

      newSocket.onopen = () => {
        newSocket.send(
          JSON.stringify({
            type: "addTransaction",
            transaction: transaction,
          })
        );
        // console.log("Transaction sent to node:", node);
      };

      newSocket.onerror = (err) => {
        console.error("Error sending transaction to node:", err);
      };
    }
  });
};

const selectRandomNode = () => {
  if (nodeList.length === 0) {
    console.error("No nodes available to select from.");
    return null;
  }
  const randomIndex = Math.floor(Math.random() * nodeList.length);
  return nodeList[randomIndex];
};
