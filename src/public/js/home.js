const profileButton = document.querySelector(".profile-button");
const profileMenu = document.querySelector(".profile-menu");
const userDetailsButton = document.querySelector("#user-details");
const userLogoutButton = document.querySelector("#logout");
const walletBalanceUsername = document.querySelector(
  "#wallet-balance-username"
);
const walletBalance = document.querySelector("#wallet-balance");
const walletAddressSpan = document.querySelector(".wallet-address-span");
const footerText = document.querySelector(".footer-text");
const depositButton = document.querySelector("#deposit-button");
const sendButton = document.querySelector("#send-button");
const depositContainer = document.querySelector(".deposit-container");
const sendContainer = document.querySelector(".send-container");
const depositForm = document.querySelector("#deposit-form");
const sendForm = document.querySelector("#send-form");
const transactionList = document.querySelector("#transactions-body");
const blocksList = document.querySelector("#blocks-list");
const mineBlockButton = document.querySelector(".mine-button");
const blockDetailsContainer = document.querySelector(
  ".block-details-container"
);
const blockDetailsContent = document.querySelector(".block-details-content");
const closeBlockDetailsButton = document.querySelector("#close-block-details");
let socket;
let nodeList = [];

let nodesReady = false;

const toggleProfileMenu = () => {
  profileMenu.classList.toggle("hidden");
};
const getProfileDetails = () => {
  alert(
    `Profile Details:\nUsername: ${window.user.username}\nEmail: ${window.user.email}\nID: ${window.user.id}\nWallet Address: ${window.user.wallet.address}\nRole: ${window.user.role}`
  );
};
const logoutProfile = () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
};

const connectToWebSocketServer = async () => {
  const config = await fetch("/env").then((res) => res.json());
  socket = new WebSocket(
    `ws://${config.NODE_MASTER_SERVER_URL}:${config.NODE_MASTER_SERVER_PORT}`
  );
  socket.onopen = () => {
    footerText.textContent = `Connected to WebSocket master server at ws://${config.NODE_MASTER_SERVER_URL}:${config.NODE_MASTER_SERVER_PORT}`;
    getNodesFromSocket();
    setInterval(() => {
      getNodesFromSocket();
    }, 5000); // Fetch nodes every 5 seconds
  };
};

let mineBlockPrompt = () => {
  const confirmation = confirm(
    "Are you sure you want to mine a new block? This will include all pending transactions in the transaction pool."
  );
  if (confirmation) {
    sendMineBlockRequest();
    updateTransactionTable();
    updateBlocksList();
  } else {
    alert("Mining cancelled.");
  }
};

const openDepositModal = async () => {
  let balance = await getBalance("0");
  availableDepositAmount.textContent = `${balance} TRC`;

  depositContainer.classList.remove("hidden");

  depositContainer.addEventListener("click", (event) => {
    if (event.target === depositContainer) {
      depositContainer.classList.add("hidden");
    }
  });
};

const openSendModal = () => {
  sendContainer.classList.remove("hidden");

  sendContainer.addEventListener("click", (event) => {
    if (event.target === sendContainer) {
      sendContainer.classList.add("hidden");
    }
  });
};

const depositFormSubmit = async (event) => {
  event.preventDefault();
  let amount = depositForm.querySelector("#deposit-amount").value;

  amount = parseFloat(amount);

  if (!amount || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid deposit amount.");
    return;
  }

  let balance = await getBalance("0");
  if (amount > balance) {
    alert("Insufficient balance to deposit this amount.");
    return;
  }

  const confirmation = confirm(`Do you want to deposit ${amount} TRC?`);

  if (!confirmation) {
    alert("Deposit cancelled.");
    return;
  }

  addTransaction("0", window.user.wallet.address, amount, "deposit");
  depositContainer.classList.add("hidden");
  depositForm.reset();
  balance = await getBalance(window.user.wallet.address);
  walletBalance.textContent = `${balance} TRC`;

  updateTransactionTable();
};

const sendFormSubmit = async (event) => {
  event.preventDefault();

  let amount = sendForm.querySelector("#send-amount").value;
  let recipient = sendForm.querySelector("#recipient-address").value;
  amount = parseFloat(amount);
  if (!amount || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid send amount.");
    return;
  }
  let balance = await getBalance(window.user.wallet.address);
  if (amount > balance) {
    alert("Insufficient balance to send this amount.");
    return;
  }
  if (!recipient || recipient.trim() === "") {
    alert("Please enter a valid recipient address.");
    return;
  }
  const confirmation = confirm(
    `Do you want to send ${amount} TRC to ${recipient}?`
  );
  if (!confirmation) {
    alert("Send cancelled.");
    return;
  }
  addTransaction(window.user.wallet.address, recipient, amount, "send");
  sendContainer.classList.add("hidden");
  sendForm.reset();
  balance = await getBalance(window.user.wallet.address);
  walletBalance.textContent = `${balance} TRC`;

  updateTransactionTable();
};

const getNodesFromSocket = () => {
  socket.send(
    JSON.stringify({
      type: "requestPeersList",
      device: "web-client",
    })
  );

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "welcome") {
      nodeList = data.peers;

      if (!nodesReady) {
        nodesReady = true;
        document.dispatchEvent(new Event("nodesReady"));
      }
    }
  };
};

document.addEventListener("userReady", async () => {
  walletBalanceUsername.textContent = window.user.username || "Guest";
  walletAddressSpan.textContent = window.user.wallet.address || "No address";

  await connectToWebSocketServer();
});

const updateTransactionTable = async () => {
  let transactions = await requestTransactionsFromNodes();

  transactionList.innerHTML = "";

  transactions.forEach((transaction) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${transaction.from}</td>
      <td>${transaction.to}</td>
      <td>${transaction.amount} TRC</td>
      <td>${transaction.message || "No message"}</td>
      <td>${new Date(transaction.timestamp).toLocaleString()}</td>
      <td>${transaction.state || "done"}</td>
    `;
    transactionList.appendChild(row);
  });
};
const updateBlocksList = async () => {
  let blocks = await requestBlocksFromNodes();

  blocksList.innerHTML = "";

  blocks.forEach((block) => {
    console.log("Block:", block);
    const div = document.createElement("div");
    div.className = "block-item";
    div.innerText = block.index;

    div.addEventListener("click", () => {
      blockDetailsContainer.classList.remove("hidden");
      blockDetailsContent.innerHTML = `
      <p><strong>Index:</strong> ${block.index}</p>
      <p><strong>Block Hash:</strong> ${block.hash}</p>
        
        <p><strong>Previous Hash:</strong> ${block.previousHash}</p>
        <p><strong>Timestamp:</strong> ${new Date(
          block.timestamp
        ).toLocaleString()}</p>
        <p><strong>Nonce:</strong> ${block.nonce}</p>
        <p><strong>Transactions:</strong></p>
        <ul>
          ${block.data.transactions
            .map(
              (tx) => `
            <li>
              <strong>From:</strong> ${tx.from} <br>
              <strong>To:</strong> ${tx.to} <br>
              <strong>Amount:</strong> ${tx.amount} TRC <br>
              <strong>Message:</strong> ${tx.message || "No message"} <br>
              <strong>Timestamp:</strong> ${new Date(
                tx.timestamp
              ).toLocaleString()}
            </li>
          `
            )
            .join("")}
        </ul>
      `;

      blockDetailsContainer.addEventListener("click", (event) => {
        if (
          event.target === blockDetailsContainer ||
          event.target === closeBlockDetailsButton
        ) {
          blockDetailsContainer.classList.add("hidden");
        }
      });
    });

    blocksList.appendChild(div);
  });
};

document.addEventListener("nodesReady", async () => {
  let balance = await getBalance(window.user.wallet.address);
  walletBalance.textContent = `${balance} TRC`;

  updateTransactionTable();

  updateBlocksList();
});

mineBlockButton.addEventListener("click", mineBlockPrompt);
profileButton.addEventListener("click", toggleProfileMenu);
userDetailsButton.addEventListener("click", getProfileDetails);
userLogoutButton.addEventListener("click", logoutProfile);
depositButton.addEventListener("click", openDepositModal);
sendButton.addEventListener("click", openSendModal);
depositForm.addEventListener("submit", depositFormSubmit);
sendForm.addEventListener("submit", sendFormSubmit);
