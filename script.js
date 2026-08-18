const portals = document.querySelectorAll('.portal');
portals.forEach((portal) => {
  portal.addEventListener('mousemove', (e) => {
    const r = portal.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    portal.style.transform = `translate(${x * 2}px, ${y * 2}px)`;
  });
  portal.addEventListener('mouseleave', () => {
    portal.style.transform = 'translate(0,0)';
  });
});
