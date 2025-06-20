const profileButton = document.querySelector(".profile-button");
const profileMenu = document.querySelector(".profile-menu");
const userDetailsButton = document.querySelector("#user-details");
const userLogoutButton = document.querySelector("#logout");
const walletBalanceUsername = document.querySelector(
  "#wallet-balance-username"
);

const toggleProfileMenu = () => {
  profileMenu.classList.toggle("hidden");
};
const getProfileDetails = () => {
  alert(
    `Profile Details:\nUsername: ${window.user.username}\nEmail: ${window.user.email}\nID: ${window.user.id}`
  );
};
const logoutProfile = () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
};

document.addEventListener("userReady", () => {
  walletBalanceUsername.textContent = window.user.username || "Guest";
});

profileButton.addEventListener("click", toggleProfileMenu);
userDetailsButton.addEventListener("click", getProfileDetails);
userLogoutButton.addEventListener("click", logoutProfile);
