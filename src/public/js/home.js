const profileButton = document.querySelector(".profile-button");
const profileMenu = document.querySelector(".profile-menu");
const userDetailsButton = document.querySelector("#user-details");
const userLogoutButton = document.querySelector("#logout");
const walletBalanceUsername = document.querySelector(
  "#wallet-balance-username"
);
const walletAddressSpan = document.querySelector(".wallet-address-span");

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

document.addEventListener("userReady", () => {
  walletBalanceUsername.textContent = window.user.username || "Guest";
  walletAddressSpan.textContent = window.user.wallet.address || "No address";
});

profileButton.addEventListener("click", toggleProfileMenu);
userDetailsButton.addEventListener("click", getProfileDetails);
userLogoutButton.addEventListener("click", logoutProfile);
