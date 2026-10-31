const projects = document.querySelectorAll(".project");
const galleryTriggers = document.querySelectorAll(".project, .gallery-trigger");
const modal = document.querySelector(".project-modal");
const modalMain = modal.querySelector(".modal-main");
const modalThumbs = modal.querySelector(".modal-thumbs");
const modalCount = modal.querySelector(".modal-count");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-nav");

let currentGallery = [];
let currentImageIndex = 0;

document.querySelector("#year").textContent = new Date().getFullYear();

// Project previews
document.querySelectorAll("[data-hover]").forEach((project) => {
  const image = project.querySelector(".project-image img");
  const images = project.dataset.hover.split("|");
  let imageIndex = 0;
  let timer;

  images.forEach((source) => {
    const preload = new Image();
    preload.src = source;
  });

  function changeImage(index) {
    image.classList.add("switching");
    window.setTimeout(() => {
      image.src = images[index];
      image.classList.remove("switching");
    }, 120);
  }

  project.addEventListener("mouseenter", () => {
    timer = window.setInterval(() => {
      imageIndex = (imageIndex + 1) % images.length;
      changeImage(imageIndex);
    }, 1100);
  });

  project.addEventListener("mouseleave", () => {
    window.clearInterval(timer);
    imageIndex = 0;
    changeImage(0);
  });
});

// Gallery
function showGalleryImage(index) {
  if (currentGallery.length === 0) return;

  currentImageIndex = (index + currentGallery.length) % currentGallery.length;
  modalMain.classList.add("switching");

  window.setTimeout(() => {
    modalMain.src = currentGallery[currentImageIndex];
    modalMain.alt = `${modal.querySelector("#modal-title").textContent} — image ${currentImageIndex + 1}`;
    modalMain.classList.remove("switching");
  }, 100);

  modalCount.textContent = `${String(currentImageIndex + 1).padStart(2, "0")} / ${String(currentGallery.length).padStart(2, "0")}`;

  modalThumbs.querySelectorAll("button").forEach((button, buttonIndex) => {
    button.classList.toggle("active", buttonIndex === currentImageIndex);
  });
}

function openProject(item) {
  modal.querySelector("#modal-title").textContent = item.dataset.title;
  modal.querySelector(".modal-meta").textContent = item.dataset.meta;
  modal.querySelector(".modal-description").textContent = item.dataset.description || "";

  const fallbackImage = item.querySelector("img")?.getAttribute("src");
  currentGallery = item.dataset.gallery
    ? item.dataset.gallery.split("|")
    : [fallbackImage];

  modalThumbs.replaceChildren();

  currentGallery.forEach((source, index) => {
    const button = document.createElement("button");
    const thumbnail = document.createElement("img");
    button.type = "button";
    button.setAttribute("aria-label", `View image ${index + 1}`);
    thumbnail.src = source;
    thumbnail.alt = "";
    button.append(thumbnail);
    button.addEventListener("click", () => showGalleryImage(index));
    modalThumbs.append(button);
  });

  modal.showModal();
  document.body.classList.add("modal-open");
  showGalleryImage(0);
}

function closeProject() {
  modal.close();
  document.body.classList.remove("modal-open");
}

galleryTriggers.forEach((item) => {
  item.addEventListener("click", () => openProject(item));
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProject(item);
    }
  });
});

document.querySelector(".print-open").addEventListener("click", () => {
  document.querySelector(".print-art").click();
});

modal.querySelector(".modal-close").addEventListener("click", closeProject);
modal.querySelector(".modal-prev").addEventListener("click", () => showGalleryImage(currentImageIndex - 1));
modal.querySelector(".modal-next").addEventListener("click", () => showGalleryImage(currentImageIndex + 1));

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeProject();
});
modal.addEventListener("close", () => document.body.classList.remove("modal-open"));
modal.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showGalleryImage(currentImageIndex - 1);
  if (event.key === "ArrowRight") showGalleryImage(currentImageIndex + 1);
});

// Mobile navigation
menuButton.addEventListener("click", () => {
  const menuIsOpen = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(menuIsOpen));
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});
