const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

const flipCard = document.querySelector(".flip-card");
if (flipCard) {
  flipCard.addEventListener("click", () => {
    flipCard.classList.toggle("is-flipped");
  });
}
