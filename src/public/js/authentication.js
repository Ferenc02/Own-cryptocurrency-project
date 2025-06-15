let urlHash = window.location.hash;
const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");
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
