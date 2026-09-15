const figures = [...document.querySelectorAll('main figure')];
const images = figures.map(figure => figure.querySelector('img'));
const lightbox = document.querySelector('.lightbox');
const viewer = lightbox.querySelector('figure img');
const caption = lightbox.querySelector('figcaption');
const count = lightbox.querySelector('.lightbox-count');
const closeButton = lightbox.querySelector('.lightbox-close');
let current = 0;
let touchStartX = 0;

function show(index) {
  current = (index + images.length) % images.length;
  const source = images[current];
  const text = source.closest('figure').querySelector('figcaption')?.textContent || source.alt;
  viewer.src = source.src;
  viewer.alt = source.alt;
  caption.textContent = text;
  count.textContent = `${current + 1} / ${images.length}`;
}

function openViewer(index) {
  show(index);
  lightbox.hidden = false;
  document.body.classList.add('no-scroll');
  closeButton.focus();
}

function closeViewer() {
  lightbox.hidden = true;
  document.body.classList.remove('no-scroll');
  figures[current].focus();
}

figures.forEach((figure, index) => {
  const image = images[index];
  figure.classList.add('viewer-item');
  figure.tabIndex = 0;
  figure.setAttribute('role', 'button');
  figure.setAttribute('aria-label', `Άνοιγμα εικόνας: ${image.alt}`);
  figure.addEventListener('click', () => openViewer(index));
  figure.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openViewer(index);
    }
  });
});

closeButton.addEventListener('click', closeViewer);
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));
lightbox.addEventListener('click', event => { if (event.target === lightbox) closeViewer(); });
lightbox.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', event => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 45) show(current + (distance < 0 ? 1 : -1));
}, { passive: true });
document.addEventListener('keydown', event => {
  if (lightbox.hidden) return;
  if (event.key === 'Escape') closeViewer();
  if (event.key === 'ArrowLeft') show(current - 1);
  if (event.key === 'ArrowRight') show(current + 1);
});
