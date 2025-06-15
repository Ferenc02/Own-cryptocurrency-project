const heroContent = document.querySelector(".hero-content");
const heroH2 = document.querySelector(".hero-content h2");
const heroH3 = document.querySelector(".hero-content h3");

const typewriter = (element, speed = 40, delay) => {
  const text = element.textContent.trim();
  let index = 0;

  element.textContent = "";
  const type = () => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  };

  setTimeout(() => {
    type();
  }, delay || 0);
};

typewriter(heroH2, 40);
typewriter(heroH3, 20, 2000);
