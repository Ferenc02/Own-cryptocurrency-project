let urlHash = window.location.hash;
const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");

const URL = "http://localhost:6200/api/users";

const postData = async (url = "", data = {}) => {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response.json();
};

const registerUser = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await postData(URL, data);
    console.log("Response:", response);
    if (response.message === "User registered") {
      localStorage.setItem("token", response.token);
      bearerToken = response.token;
      window.location.href = "home.html";
    } else {
      console.error("Registration failed:", response);
      alert("Registration failed: " + response.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
const loginUser = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());
  try {
    const response = await postData(URL, data);

    if (response.message === "Login successful") {
      localStorage.setItem("token", response.token);

      window.location.href = "home.html";
      // Redirect or perform further actions
    } else {
      console.error("Login failed:", response);
      alert("Login failed: " + response.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

registerForm.addEventListener("submit", (event) => {
  registerUser(event);
});
loginForm.addEventListener("submit", (event) => {
  loginUser(event);
});

window.addEventListener("hashchange", (event) => {
  loadForm();
});

const loadForm = () => {
  urlHash = window.location.hash;

  if (urlHash === "#login") {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
  } else if (urlHash === "#register") {
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  } else if (urlHash === "" || urlHash === "#") {
    registerForm.classList.add("hidden");
  }
};

loadForm();
