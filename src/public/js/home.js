const profileButton = document.querySelector(".profile-button");
const profileMenu = document.querySelector(".profile-menu");
const userDetailsButton = document.querySelector("#user-details");
const userLogoutButton = document.querySelector("#logout");
const walletBalanceUsername = document.querySelector(
  "#wallet-balance-username"
);
const walletAddressSpan = document.querySelector(".wallet-address-span");
const footerText = document.querySelector(".footer-text");

let socket;
let nodeList = [];

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
    }
  };
};

document.addEventListener("userReady", async () => {
  walletBalanceUsername.textContent = window.user.username || "Guest";
  walletAddressSpan.textContent = window.user.wallet.address || "No address";

  await connectToWebSocketServer();
});

profileButton.addEventListener("click", toggleProfileMenu);
userDetailsButton.addEventListener("click", getProfileDetails);
userLogoutButton.addEventListener("click", logoutProfile);
