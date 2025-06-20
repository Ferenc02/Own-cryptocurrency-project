let mineBlockButton = document.querySelector(".mine-button");

let transactionPool = [];

let mineBlockPrompt = () => {
  const confirmation = confirm(
    `Do you want to mine a new block with the current transaction pool?\ntransactionPool: ${JSON.stringify(
      transactionPool,
      null,
      2
    )}`
  );
  if (confirmation) {
    sendMineBlockRequest();
  } else {
    alert("Mining cancelled.");
  }
};

const sendMineBlockRequest = () => {
  nodeList.forEach((node) => {
    if (node.ws === "connected") {
      let newSocket = new WebSocket(`ws://${node.address}:${node.port}`);

      newSocket.onopen = () => {
        newSocket.send(
          JSON.stringify({
            type: "mineBlock",
            transactions: transactionPool,
          })
        );
        console.log("Request to mine block sent to node:", node);
      };
    }
  });
};

const addTransactionToPool = (transaction) => {
  if (transaction && transaction.from && transaction.to && transaction.amount) {
    transactionPool.push(transaction);
    console.log("Transaction added to pool:", transaction);
  } else {
    console.error("Invalid transaction, cannot be added to the pool.");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  mineBlockButton.addEventListener("click", mineBlockPrompt);
});
