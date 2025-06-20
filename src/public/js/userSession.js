const TOKEN_URL = "http://localhost:6200/api/token";

let user;
let bearerToken = localStorage.getItem("token");
window.addEventListener("DOMContentLoaded", async () => {
  let pathname = window.location.pathname;
  let page = pathname.split("/").pop();

  if (!bearerToken) {
    if (page !== "login.html") {
      window.location.href = "login.html";
    }
    return;
  }

  const isValid = await verifyToken();
  console.log(isValid);
  if (!isValid) {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }
  if (isValid && page === "login.html") {
    window.location.href = "home.html";
  }
});

const verifyToken = async () => {
  try {
    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    if (!response.ok) {
      throw new Error("Token verification failed");
    }
    const data = await response.json();
    if (data.message === "Token is valid") {
      user = data.user;
      return true;
    } else {
      console.error("Token verification failed:", data);
      return false;
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
};
